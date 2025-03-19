-- Create the items table
create table public.items (
  id uuid default uuid_generate_v4() primary key,
  title text not null,
  description text,
  location text,
  date date not null,
  image_url text,
  type text not null check (type in ('lost', 'found')),
  claim_requirements text[],
  reward text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  user_email text not null
);

-- Enable Row Level Security (RLS)
alter table public.items enable row level security;

-- Create policy to allow anyone to read items
create policy "Anyone can read items"
  on public.items for select
  using ( true );

-- Create policy to allow authenticated users to insert their own items
create policy "Authenticated users can insert their own items"
  on public.items for insert
  with check ( auth.role() = 'authenticated' );

-- Create policy to allow users to delete items
create policy "Anyone can delete items"
  on public.items for delete
  using ( true );

-- Create storage bucket for item images
insert into storage.buckets (id, name, public) values ('item-images', 'item-images', true);

-- Allow public access to item images
create policy "Public Access"
  on storage.objects for select
  using ( bucket_id = 'item-images' );

-- Allow authenticated users to upload images
create policy "Authenticated users can upload images"
  on storage.objects for insert
  with check (
    bucket_id = 'item-images' 
    and auth.role() = 'authenticated'
  );
