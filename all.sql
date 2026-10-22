-- ملف واحد يكفي: الصقه كله بـ Supabase SQL Editor ثم Run
-- (يشتغل حتى لو شغّلته قبل، ما يمسح بياناتك)

create table if not exists profiles(id uuid primary key references auth.users on delete cascade,name text,email text,role text default 'user');
create table if not exists products(id bigint generated always as identity primary key,section text,name text,descr text,price text,image_url text,owner uuid references auth.users,owner_name text,created_at timestamptz default now());
create table if not exists likes(product_id bigint references products on delete cascade,user_id uuid references auth.users,primary key(product_id,user_id));
create table if not exists comments(id bigint generated always as identity primary key,product_id bigint references products on delete cascade,user_id uuid references auth.users,user_name text,body text,created_at timestamptz default now());
create table if not exists publishers(email text primary key);

alter table profiles enable row level security;
alter table products enable row level security;
alter table likes enable row level security;
alter table comments enable row level security;
alter table publishers enable row level security;

create or replace function is_admin() returns boolean language sql security definer set search_path=public as $$select exists(select 1 from profiles where id=auth.uid() and role='admin')$$;
create or replace function is_pub() returns boolean language sql security definer set search_path=public as $$select exists(select 1 from profiles where id=auth.uid() and role in('admin','publisher'))$$;

drop policy if exists "own profile" on profiles;
drop policy if exists "edit own name" on profiles;
drop policy if exists "see products" on products;
drop policy if exists "publish" on products;
drop policy if exists "delete product" on products;
drop policy if exists "see likes" on likes;
drop policy if exists "like" on likes;
drop policy if exists "unlike" on likes;
drop policy if exists "see comments" on comments;
drop policy if exists "comment" on comments;
drop policy if exists "delete comment" on comments;
drop policy if exists "admin sees publishers" on publishers;

create policy "own profile" on profiles for select using(id=auth.uid() or is_admin());
create policy "edit own name" on profiles for update using(id=auth.uid()) with check(id=auth.uid());
create policy "see products" on products for select using(true);
create policy "publish" on products for insert with check(is_pub() and owner=auth.uid());
create policy "delete product" on products for delete using(owner=auth.uid() or is_admin());
create policy "see likes" on likes for select using(true);
create policy "like" on likes for insert with check(user_id=auth.uid());
create policy "unlike" on likes for delete using(user_id=auth.uid());
create policy "see comments" on comments for select using(true);
create policy "comment" on comments for insert with check(user_id=auth.uid());
create policy "delete comment" on comments for delete using(user_id=auth.uid() or is_admin());
create policy "admin sees publishers" on publishers for select using(is_admin());

-- المستخدم يغير اسمه فقط، مو صلاحيته
revoke update on profiles from authenticated, anon;
grant update(name) on profiles to authenticated;

-- حساب جديد: إذا إيميله مضاف كناشر يصير ناشر تلقائياً
create or replace function handle_new_user() returns trigger language plpgsql security definer set search_path=public as $$
begin
  insert into profiles(id,name,email,role) values(new.id,new.raw_user_meta_data->>'name',new.email,
    case when exists(select 1 from publishers where email=lower(new.email)) then 'publisher' else 'user' end)
  on conflict (id) do nothing;
  return new;
end$$;
drop trigger if exists on_signup on auth.users;
create trigger on_signup after insert on auth.users for each row execute function handle_new_user();

create or replace function add_publisher(e text) returns void language plpgsql security definer set search_path=public as $$
begin
  if not is_admin() then raise exception 'للادمن فقط'; end if;
  e:=lower(trim(e));
  insert into publishers values(e) on conflict do nothing;
  update profiles set role='publisher' where lower(email)=e and role<>'admin';
end$$;

create or replace function remove_publisher(e text) returns void language plpgsql security definer set search_path=public as $$
begin
  if not is_admin() then raise exception 'للادمن فقط'; end if;
  e:=lower(trim(e));
  delete from publishers where email=e;
  update profiles set role='user' where lower(email)=e and role='publisher';
end$$;

-- كل منتج جديد لازم يكون له صورة
alter table products drop constraint if exists img_req;
alter table products add constraint img_req check(image_url is not null and image_url<>'') not valid;

-- مخزن الصور
insert into storage.buckets(id,name,public) values('images','images',true) on conflict do nothing;
drop policy if exists "upload images" on storage.objects;
drop policy if exists "read images" on storage.objects;
create policy "upload images" on storage.objects for insert to authenticated with check(bucket_id='images' and is_pub());
create policy "read images" on storage.objects for select using(bucket_id='images');

-- بعد ما تسجل حسابك بالموقع، شغّل هذا السطر مرة وحدة (بدّل الإيميل) وتصير أدمن:
-- update profiles set role='admin' where email='YOUR_EMAIL';
