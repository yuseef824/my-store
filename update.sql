-- شغّله مرة وحدة بـ Supabase: SQL Editor ثم Run
create table if not exists publishers(email text primary key);
alter table publishers enable row level security;
create policy "admin sees publishers" on publishers for select using(is_admin());

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

-- اللي يسجل وإيميله مضاف مسبقاً يصير ناشر تلقائياً
create or replace function handle_new_user() returns trigger language plpgsql security definer set search_path=public as $$
begin
  insert into profiles(id,name,email,role) values(new.id,new.raw_user_meta_data->>'name',new.email,
    case when exists(select 1 from publishers where email=lower(new.email)) then 'publisher' else 'user' end);
  return new;
end$$;

-- كل منتج جديد لازم يكون له صورة
alter table products add constraint img_req check(image_url is not null and image_url<>'') not valid;

-- المستخدم يقدر يغير اسمه فقط، مو صلاحيته
create policy "edit own name" on profiles for update using(id=auth.uid()) with check(id=auth.uid());
revoke update on profiles from authenticated, anon;
grant update(name) on profiles to authenticated;


-- تذاكر الدعم الفني والاقتراحات
create table if not exists tickets(
  id bigint generated always as identity primary key,
  user_id uuid references auth.users on delete set null,
  email text,
  kind text not null default 'استفسار',
  subject text not null,
  body text not null,
  status text not null default 'open' check(status in ('open','in_progress','closed')),
  created_at timestamptz not null default now()
);
alter table tickets enable row level security;
drop policy if exists "create own tickets" on tickets;
create policy "create own tickets" on tickets for insert to authenticated with check(user_id=auth.uid());
drop policy if exists "read own tickets or admin" on tickets;
create policy "read own tickets or admin" on tickets for select to authenticated using(user_id=auth.uid() or is_admin());
drop policy if exists "admin update tickets" on tickets;
create policy "admin update tickets" on tickets for update to authenticated using(is_admin()) with check(is_admin());


-- صور الحسابات: تشغيل هذا الجزء آمن على قاعدة بيانات موجودة
alter table profiles add column if not exists avatar_url text;
grant update(name,avatar_url) on profiles to authenticated;
insert into storage.buckets(id,name,public) values('avatars','avatars',true) on conflict(id) do nothing;
drop policy if exists "read avatars" on storage.objects;
create policy "read avatars" on storage.objects for select using(bucket_id='avatars');
drop policy if exists "upload own avatar" on storage.objects;
create policy "upload own avatar" on storage.objects for insert to authenticated with check(bucket_id='avatars' and (storage.foldername(name))[1]=auth.uid()::text);
drop policy if exists "update own avatar" on storage.objects;
create policy "update own avatar" on storage.objects for update to authenticated using(bucket_id='avatars' and (storage.foldername(name))[1]=auth.uid()::text) with check(bucket_id='avatars' and (storage.foldername(name))[1]=auth.uid()::text);
