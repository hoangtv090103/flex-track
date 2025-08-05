# Migration từ Firebase sang Supabase cho FlexTrack

## 🎯 Trạng thái hiện tại
- ✅ **Đã loại bỏ Firebase dependencies**
- ✅ **Service layer đã được refactor**
- ✅ **API routes sử dụng localStorage**
- ✅ **Authentication vẫn sử dụng Clerk**

## 🔄 Bước tiếp theo: Setup Supabase

### 1. Tạo Supabase Project
1. Truy cập [supabase.com](https://supabase.com)
2. Tạo account và project mới
3. Copy URL và Anon Key

### 2. Cập nhật Environment Variables
Thêm vào `.env.local`:
```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### 3. Tạo Database Schema
Chạy SQL commands trong Supabase SQL Editor:

```sql
-- Create profiles table for user data
create table profiles (
  id uuid references auth.users on delete cascade primary key,
  email text,
  name text,
  avatar_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create workouts table
create table workouts (
  id uuid default gen_random_uuid() primary key,
  user_id text not null, -- Clerk user ID
  date timestamp with time zone not null,
  exercises jsonb not null,
  duration integer,
  notes text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create indexes for better performance
create index workouts_user_id_idx on workouts (user_id);
create index workouts_date_idx on workouts (date desc);

-- Enable Row Level Security
alter table profiles enable row level security;
alter table workouts enable row level security;

-- Create policies (allow all for now, can be restricted later)
create policy "Allow all operations for authenticated users" on profiles for all using (true);
create policy "Allow all operations for authenticated users" on workouts for all using (true);
```

### 4. Cập nhật Supabase Service
File `/src/services/supabaseWorkoutService.ts` (tạo mới):

```typescript
import { supabase, Database } from '@/lib/supabase';
import { Workout } from '@/domain/entities';

type WorkoutRow = Database['public']['Tables']['workouts']['Row'];
type WorkoutInsert = Database['public']['Tables']['workouts']['Insert'];

export const supabaseWorkoutService = {
  async saveWorkout(workoutData: Omit<Workout, 'id'>, userId: string): Promise<string> {
    const { data, error } = await supabase
      .from('workouts')
      .insert({
        user_id: userId,
        date: workoutData.date.toISOString(),
        exercises: workoutData.exercises,
        duration: workoutData.duration,
        notes: workoutData.notes || '',
      })
      .select('id')
      .single();

    if (error) throw error;
    return data.id;
  },

  async getUserWorkouts(userId: string): Promise<Workout[]> {
    const { data, error } = await supabase
      .from('workouts')
      .select('*')
      .eq('user_id', userId)
      .order('date', { ascending: false });

    if (error) throw error;

    return data.map(row => ({
      id: row.id,
      userId: row.user_id,
      date: new Date(row.date),
      exercises: row.exercises as any[],
      duration: row.duration || undefined,
      notes: row.notes || undefined,
      createdAt: new Date(row.created_at),
      updatedAt: new Date(row.updated_at),
    }));
  },

  // Additional methods...
};
```

### 5. Cập nhật API Routes
Thay thế `workoutService` bằng `supabaseWorkoutService` trong:
- `/src/app/api/workouts/route.ts`
- `/src/app/api/workouts/history/route.ts`

## 🎯 Lợi ích của Supabase

### So với Firebase:
- **✅ PostgreSQL**: Powerful relational database
- **✅ Real-time subscriptions**: WebSocket connections
- **✅ Built-in Auth**: Nếu muốn thay thế Clerk
- **✅ Edge Functions**: Serverless functions tại edge
- **✅ Storage**: File storage tích hợp
- **✅ Better developer experience**: Dashboard, SQL editor

### Performance:
- **Faster queries**: PostgreSQL với proper indexing
- **Type safety**: Generated TypeScript types
- **Real-time**: Live data updates
- **Edge deployment**: Lower latency

## 🚀 Deployment
1. **Development**: Sử dụng localStorage service hiện tại
2. **Production**: Migrate to Supabase khi ready
3. **Gradual migration**: Có thể chạy song song

## 📊 Current Status: WORKING
- ✅ Save workout functionality works
- ✅ Auto-timer implemented  
- ✅ Add exercises to top of list
- ✅ Redirect after save
- ✅ No Firebase dependency errors

Ứng dụng hiện tại hoạt động hoàn hảo với localStorage. Supabase migration có thể thực hiện khi cần scale hoặc collaboration features.
