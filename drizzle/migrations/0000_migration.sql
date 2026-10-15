
-- Roles
create type public.app_role as enum ('admin', 'moderator', 'user');
create type public.content_status as enum ('draft', 'published', 'hidden');
create type public.training_type as enum ('technical', 'physical', 'tactical', 'mental');

create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  role app_role not null,
  created_at timestamptz not null default now(),
  unique (user_id, role)
);
grant select, insert, delete on public.user_roles to authenticated;
grant all on public.user_roles to service_role;
alter table public.user_roles enable row level security;

create or replace function public.has_role(_user_id uuid, _role app_role)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.user_roles where user_id = _user_id and role = _role)
$$;

create policy "own roles readable" on public.user_roles for select to authenticated
  using (user_id = auth.uid() or public.has_role(auth.uid(), 'admin'));
create policy "admins manage roles insert" on public.user_roles for insert to authenticated
  with check (public.has_role(auth.uid(), 'admin'));
create policy "admins manage roles delete" on public.user_roles for delete to authenticated
  using (public.has_role(auth.uid(), 'admin') and user_id <> auth.uid());

-- First admin bootstrap: only works while no admin exists
create or replace function public.claim_first_admin()
returns boolean language plpgsql security definer set search_path = public as $$
begin
  if auth.uid() is null then return false; end if;
  if exists (select 1 from public.user_roles where role = 'admin') then return false; end if;
  insert into public.user_roles (user_id, role) values (auth.uid(), 'admin');
  return true;
end $$;
create or replace function public.admin_exists()
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.user_roles where role = 'admin')
$$;
revoke execute on function public.claim_first_admin() from anon;

-- Positions
create table public.positions (
  code text primary key,
  name_ar text not null,
  sort_order int not null default 0
);
grant select on public.positions to anon, authenticated;
grant insert, update, delete on public.positions to authenticated;
grant all on public.positions to service_role;
alter table public.positions enable row level security;
create policy "positions public read" on public.positions for select to anon, authenticated using (true);
create policy "positions admin write" on public.positions for all to authenticated
  using (public.has_role(auth.uid(), 'admin')) with check (public.has_role(auth.uid(), 'admin'));

insert into public.positions (code, name_ar, sort_order) values
 ('ST','مهاجم صريح',1),('RW','جناح أيمن',2),('LW','جناح أيسر',3),('CAM','وسط هجومي',4),
 ('CM','وسط مركزي',5),('CDM','وسط دفاعي',6),('RB','ظهير أيمن',7),('LB','ظهير أيسر',8),
 ('CB','قلب دفاع',9),('GK','حارس مرمى',10);

-- Categories
create table public.categories (
  id uuid primary key default gen_random_uuid(),
  training_type training_type not null,
  name_ar text not null,
  description text,
  sort_order int not null default 0,
  is_visible boolean not null default true,
  created_at timestamptz not null default now()
);
grant select on public.categories to anon, authenticated;
grant insert, update, delete on public.categories to authenticated;
grant all on public.categories to service_role;
alter table public.categories enable row level security;
create policy "categories read" on public.categories for select to anon, authenticated
  using (is_visible or public.has_role(auth.uid(), 'admin'));
create policy "categories admin write" on public.categories for all to authenticated
  using (public.has_role(auth.uid(), 'admin')) with check (public.has_role(auth.uid(), 'admin'));

insert into public.categories (training_type, name_ar, sort_order) values
 ('technical','التحكم بالكرة',1),('technical','المراوغة',2),('technical','المواجهات الفردية واحد ضد واحد',3),
 ('technical','التمرير القصير والطويل',4),('technical','الاستلام تحت الضغط',5),('technical','التسديد',6),
 ('technical','الإنهاء أمام المرمى',7),('technical','العرضيات',8),('technical','اللعب بالقدم الأضعف',9),
 ('technical','المهارات الخاصة بكل مركز',10),
 ('physical','التسارع',1),('physical','السرعة القصوى',2),('physical','القوة الانفجارية',3),
 ('physical','القفز والارتقاء',4),('physical','القوة العضلية المناسبة لكرة القدم',5),('physical','التوازن',6),
 ('physical','الرشاقة',7),('physical','تغيير الاتجاه',8),('physical','المرونة والحركة',9),
 ('physical','التحمل',10),('physical','الوقاية من الإصابات',11),
 ('tactical','التمركز',1),('tactical','التحرك دون كرة',2),('tactical','الضغط على الخصم',3),
 ('tactical','التحولات الهجومية والدفاعية',4),('tactical','اتخاذ القرار',5),('tactical','قراءة اللعب',6),
 ('tactical','التحرك داخل المساحات',7),('tactical','الأدوار التكتيكية لكل مركز',8),('tactical','فهم الخطط الجماعية',9),
 ('mental','التركيز',1),('mental','الثقة أثناء المباريات',2),('mental','اتخاذ القرار تحت الضغط',3),
 ('mental','التعامل مع الأخطاء',4),('mental','الانضباط',5),('mental','الاستعداد الذهني للمباريات',6);

-- Profiles
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  username text not null default '',
  age int,
  primary_position text references public.positions(code) on update cascade,
  secondary_position text references public.positions(code) on update cascade,
  level text check (level in ('beginner','intermediate','advanced')),
  goal text,
  days_per_week int check (days_per_week between 1 and 7),
  facilities text[] not null default '{}',
  notes text,
  height_cm int,
  weight_kg numeric,
  personal_goals text,
  current_program_id uuid,
  subscription_tier text not null default 'free',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
grant select, insert, update on public.profiles to authenticated;
grant all on public.profiles to service_role;
alter table public.profiles enable row level security;
create policy "profile read own or admin" on public.profiles for select to authenticated
  using (id = auth.uid() or public.has_role(auth.uid(), 'admin'));
create policy "profile insert own" on public.profiles for insert to authenticated with check (id = auth.uid());
create policy "profile update own" on public.profiles for update to authenticated
  using (id = auth.uid()) with check (id = auth.uid());

-- prevent users from changing their own subscription tier
create or replace function public.protect_profile_fields()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  if new.subscription_tier is distinct from old.subscription_tier
     and not public.has_role(auth.uid(), 'admin') and auth.role() <> 'service_role' then
    new.subscription_tier := old.subscription_tier;
  end if;
  new.updated_at := now();
  return new;
end $$;
create trigger profiles_protect before update on public.profiles
  for each row execute function public.protect_profile_fields();

create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
declare m jsonb := coalesce(new.raw_user_meta_data, '{}'::jsonb);
begin
  insert into public.profiles (id, username, age, primary_position, secondary_position, level, goal,
    days_per_week, facilities, notes, height_cm, weight_kg)
  values (
    new.id,
    coalesce(nullif(m->>'username',''), split_part(new.email,'@',1)),
    nullif(m->>'age','')::int,
    (select code from public.positions where code = m->>'primary_position'),
    (select code from public.positions where code = m->>'secondary_position'),
    case when m->>'level' in ('beginner','intermediate','advanced') then m->>'level' end,
    nullif(m->>'goal',''),
    case when (m->>'days_per_week') ~ '^[1-7]$' then (m->>'days_per_week')::int end,
    coalesce(array(select jsonb_array_elements_text(case when jsonb_typeof(m->'facilities')='array' then m->'facilities' else '[]'::jsonb end)), '{}'),
    nullif(m->>'notes',''),
    case when (m->>'height_cm') ~ '^\d{2,3}$' then (m->>'height_cm')::int end,
    case when (m->>'weight_kg') ~ '^\d{2,3}(\.\d+)?$' then (m->>'weight_kg')::numeric end
  );
  insert into public.user_roles (user_id, role) values (new.id, 'user');
  return new;
exception when others then
  insert into public.profiles (id, username) values (new.id, split_part(new.email,'@',1)) on conflict do nothing;
  return new;
end $$;
create trigger on_auth_user_created after insert on auth.users
  for each row execute function public.handle_new_user();

-- Exercises
create table public.exercises (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  summary text,
  training_type training_type not null,
  category_id uuid references public.categories(id) on delete set null,
  positions text[] not null default '{}',
  levels text[] not null default '{}',
  age_min int, age_max int,
  objective text,
  equipment text,
  location text,
  duration_min int,
  sets int,
  reps text,
  rest text,
  steps text[] not null default '{}',
  common_mistakes text,
  tips text,
  image_url text,
  video_url text,
  safety_notes text,
  status content_status not null default 'draft',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
grant select on public.exercises to anon, authenticated;
grant insert, update, delete on public.exercises to authenticated;
grant all on public.exercises to service_role;
alter table public.exercises enable row level security;
create policy "exercises read published" on public.exercises for select to anon, authenticated
  using (status = 'published' or public.has_role(auth.uid(), 'admin'));
create policy "exercises admin write" on public.exercises for all to authenticated
  using (public.has_role(auth.uid(), 'admin')) with check (public.has_role(auth.uid(), 'admin'));

-- Programs
create table public.programs (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  positions text[] not null default '{}',
  levels text[] not null default '{}',
  age_min int, age_max int,
  goals text,
  weeks int not null default 1 check (weeks between 1 and 52),
  days_per_week int not null default 3 check (days_per_week between 1 and 7),
  cover_url text,
  is_premium boolean not null default false,
  status content_status not null default 'draft',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
grant select on public.programs to anon, authenticated;
grant insert, update, delete on public.programs to authenticated;
grant all on public.programs to service_role;
alter table public.programs enable row level security;
create policy "programs read published" on public.programs for select to anon, authenticated
  using (status = 'published' or public.has_role(auth.uid(), 'admin'));
create policy "programs admin write" on public.programs for all to authenticated
  using (public.has_role(auth.uid(), 'admin')) with check (public.has_role(auth.uid(), 'admin'));

alter table public.profiles add constraint profiles_current_program_fk
  foreign key (current_program_id) references public.programs(id) on delete set null;

create table public.program_days (
  id uuid primary key default gen_random_uuid(),
  program_id uuid not null references public.programs(id) on delete cascade,
  week_number int not null default 1,
  day_number int not null default 1,
  title text,
  notes text,
  unique (program_id, week_number, day_number)
);
grant select on public.program_days to anon, authenticated;
grant insert, update, delete on public.program_days to authenticated;
grant all on public.program_days to service_role;
alter table public.program_days enable row level security;
create policy "days read" on public.program_days for select to anon, authenticated
  using (exists (select 1 from public.programs p where p.id = program_id and (p.status='published' or public.has_role(auth.uid(),'admin'))));
create policy "days admin write" on public.program_days for all to authenticated
  using (public.has_role(auth.uid(), 'admin')) with check (public.has_role(auth.uid(), 'admin'));

create table public.program_day_exercises (
  id uuid primary key default gen_random_uuid(),
  day_id uuid not null references public.program_days(id) on delete cascade,
  exercise_id uuid not null references public.exercises(id) on delete cascade,
  sort_order int not null default 0,
  duration_min int,
  rest text,
  notes text
);
grant select on public.program_day_exercises to anon, authenticated;
grant insert, update, delete on public.program_day_exercises to authenticated;
grant all on public.program_day_exercises to service_role;
alter table public.program_day_exercises enable row level security;
create policy "pde read" on public.program_day_exercises for select to anon, authenticated
  using (exists (select 1 from public.program_days d join public.programs p on p.id=d.program_id
    where d.id = day_id and (p.status='published' or public.has_role(auth.uid(),'admin'))));
create policy "pde admin write" on public.program_day_exercises for all to authenticated
  using (public.has_role(auth.uid(), 'admin')) with check (public.has_role(auth.uid(), 'admin'));

-- Progress
create table public.completions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  program_id uuid not null references public.programs(id) on delete cascade,
  day_exercise_id uuid not null references public.program_day_exercises(id) on delete cascade,
  completed_at timestamptz not null default now(),
  unique (user_id, day_exercise_id)
);
grant select, insert, delete on public.completions to authenticated;
grant all on public.completions to service_role;
alter table public.completions enable row level security;
create policy "completions own read" on public.completions for select to authenticated
  using (user_id = auth.uid() or public.has_role(auth.uid(),'admin'));
create policy "completions own insert" on public.completions for insert to authenticated with check (user_id = auth.uid());
create policy "completions own delete" on public.completions for delete to authenticated using (user_id = auth.uid());

-- Editable pages
create table public.site_pages (
  slug text primary key,
  title text not null,
  content text not null default '',
  updated_at timestamptz not null default now()
);
grant select on public.site_pages to anon, authenticated;
grant insert, update, delete on public.site_pages to authenticated;
grant all on public.site_pages to service_role;
alter table public.site_pages enable row level security;
create policy "pages read" on public.site_pages for select to anon, authenticated using (true);
create policy "pages admin write" on public.site_pages for all to authenticated
  using (public.has_role(auth.uid(), 'admin')) with check (public.has_role(auth.uid(), 'admin'));
insert into public.site_pages (slug, title, content) values
 ('about','حول IRON MIND FC',''),('privacy','سياسة الخصوصية',''),('terms','شروط الاستخدام',''),('mission','رسالة IRON MIND FC','');

-- Contact
create table public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 1 and 100),
  email text not null check (char_length(email) between 3 and 255),
  message text not null check (char_length(message) between 1 and 2000),
  created_at timestamptz not null default now()
);
grant insert on public.contact_messages to anon, authenticated;
grant select, delete on public.contact_messages to authenticated;
grant all on public.contact_messages to service_role;
alter table public.contact_messages enable row level security;
create policy "contact insert" on public.contact_messages for insert to anon, authenticated with check (true);
create policy "contact admin read" on public.contact_messages for select to authenticated using (public.has_role(auth.uid(),'admin'));
create policy "contact admin delete" on public.contact_messages for delete to authenticated using (public.has_role(auth.uid(),'admin'));

-- Storage policies for media bucket
create policy "media public read" on storage.objects for select using (bucket_id = 'media');
create policy "media admin insert" on storage.objects for insert to authenticated
  with check (bucket_id = 'media' and public.has_role(auth.uid(),'admin'));
create policy "media admin update" on storage.objects for update to authenticated
  using (bucket_id = 'media' and public.has_role(auth.uid(),'admin'));
create policy "media admin delete" on storage.objects for delete to authenticated
  using (bucket_id = 'media' and public.has_role(auth.uid(),'admin'));
