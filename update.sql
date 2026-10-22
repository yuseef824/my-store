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
