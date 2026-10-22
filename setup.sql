-- الصق هذا كله في Supabase: SQL Editor ثم Run
create table profiles(id uuid primary key references auth.users on delete cascade,name text,email text,role text default 'user');
create table products(id bigint generated always as identity primary key,section text,name text,descr text,price text,image_url text,owner uuid references auth.users,owner_name text,created_at timestamptz default now());
create table likes(product_id bigint references products on delete cascade,user_id uuid references auth.users,primary key(product_id,user_id));
create table comments(id bigint generated always as identity primary key,product_id bigint references products on delete cascade,user_id uuid references auth.users,user_name text,body text,created_at timestamptz default now());
alter table profiles enable row level security;
alter table products enable row level security;
alter table likes enable row level security;
alter table comments enable row level security;
create function is_admin() returns boolean language sql security definer set search_path=public as $$select exists(select 1 from profiles where id=auth.uid() and role='admin')$$;
create function is_pub() returns boolean language sql security definer set search_path=public as $$select exists(select 1 from profiles where id=auth.uid() and role in('admin','publisher'))$$;
create policy "own profile" on profiles for select using(id=auth.uid() or is_admin());
create policy "see products" on products for select using(true);
create policy "publish" on products for insert with check(is_pub() and owner=auth.uid());
create policy "delete product" on products for delete using(owner=auth.uid() or is_admin());
create policy "see likes" on likes for select using(true);
create policy "like" on likes for insert with check(user_id=auth.uid());
create policy "unlike" on likes for delete using(user_id=auth.uid());
create policy "see comments" on comments for select using(true);
create policy "comment" on comments for insert with check(user_id=auth.uid());
create policy "delete comment" on comments for delete using(user_id=auth.uid() or is_admin());
create function handle_new_user() returns trigger language plpgsql security definer set search_path=public as $$begin insert into profiles(id,name,email) values(new.id,new.raw_user_meta_data->>'name',new.email);return new;end$$;
create trigger on_signup after insert on auth.users for each row execute function handle_new_user();
create function set_role(e text,r text) returns void language plpgsql security definer set search_path=public as $$begin if not is_admin() then raise exception 'للادمن فقط';end if;update profiles set role=r where email=e;end$$;
insert into storage.buckets(id,name,public) values('images','images',true);
create policy "upload images" on storage.objects for insert to authenticated with check(bucket_id='images' and is_pub());
create policy "read images" on storage.objects for select using(bucket_id='images');
-- بعد ما تسجل حسابك بالموقع، شغّل هذا السطر مرة وحدة (بدّل الإيميل) حتى تصير أدمن:
-- update profiles set role='admin' where email='YOUR_EMAIL';
