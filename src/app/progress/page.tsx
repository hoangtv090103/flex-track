'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, TrendingUp, Calendar, Target } from 'lucide-react';

interface ProgressData {
  date: string;
  weight: number;
  reps: number;
  exercise: string;
}

export default function ProgressPage() {
  const [selectedExercise, setSelectedExercise] = useState('Bench Press');
  const [timeframe, setTimeframe] = useState('3months');
  const [progressData, setProgressData] = useState<ProgressData[]>([]);

  useEffect(() => {
    // Mock progress data
    const mockData: ProgressData[] = [
      { date: '2024-01-01', weight: 50, reps: 10, exercise: 'Bench Press' },
      { date: '2024-01-15', weight: 55, reps: 10, exercise: 'Bench Press' },
      { date: '2024-02-01', weight: 60, reps: 8, exercise: 'Bench Press' },
      { date: '2024-02-15', weight: 62.5, reps: 8, exercise: 'Bench Press' },
      { date: '2024-03-01', weight: 65, reps: 8, exercise: 'Bench Press' },
      { date: '2024-03-15', weight: 67.5, reps: 6, exercise: 'Bench Press' },
      { date: '2024-04-01', weight: 70, reps: 6, exercise: 'Bench Press' },
    ];
    setProgressData(mockData);
  }, [selectedExercise]);

  const exercises = ['Bench Press', 'Squat', 'Deadlift', 'Pull-ups'];
  const timeframes = [
    { key: '1month', label: '1 tháng' },
    { key: '3months', label: '3 tháng' },
    { key: '6months', label: '6 tháng' },
    { key: '1year', label: '1 năm' },
  ];

  const getCurrentProgress = () => {
    if (progressData.length === 0) return null;
    const latest = progressData[progressData.length - 1];
    const first = progressData[0];
    
    return {
      currentWeight: latest.weight,
      weightIncrease: latest.weight - first.weight,
      currentReps: latest.reps,
      totalSessions: progressData.length,
    };
  };

  const getMaxValues = () => {
    if (progressData.length === 0) return { maxWeight: 0, maxReps: 0 };
    
    return {
      maxWeight: Math.max(...progressData.map(d => d.weight)),
      maxReps: Math.max(...progressData.map(d => d.reps)),
    };
  };

  const currentProgress = getCurrentProgress();
  const maxValues = getMaxValues();

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-primary-600 text-white p-4">
        <div className="flex items-center justify-between">
          <Link href="/">
            <ArrowLeft className="w-6 h-6" />
          </Link>
          <h1 className="text-lg font-semibold">Biểu đồ tiến độ</h1>
          <div className="w-6"></div>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Exercise Selector */}
        <div className="bg-white rounded-2xl shadow-lg p-4">
          <h2 className="text-lg font-semibold text-gray-800 mb-3">Chọn bài tập</h2>
          <div className="grid grid-cols-2 gap-2">
            {exercises.map((exercise) => (
              <button
                key={exercise}
                onClick={() => setSelectedExercise(exercise)}
                className={`p-3 rounded-lg font-medium text-sm ${
                  selectedExercise === exercise
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {exercise}
              </button>
            ))}
          </div>
        </div>

        {/* Timeframe Selector */}
        <div className="bg-white rounded-2xl shadow-lg p-4">
          <h2 className="text-lg font-semibold text-gray-800 mb-3">Khoảng thời gian</h2>
          <div className="grid grid-cols-4 gap-2">
            {timeframes.map((tf) => (
              <button
                key={tf.key}
                onClick={() => setTimeframe(tf.key)}
                className={`p-2 rounded-lg font-medium text-xs ${
                  timeframe === tf.key
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {tf.label}
              </button>
            ))}
          </div>
        </div>

        {/* Progress Stats */}
        {currentProgress && (
          <div className="bg-white rounded-2xl shadow-lg p-4">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Thống kê hiện tại</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-primary-50 rounded-lg p-3 text-center">
                <div className="text-2xl font-bold text-primary-600">
                  {currentProgress.currentWeight}kg
                </div>
                <div className="text-sm text-gray-600">Tạ hiện tại</div>
                <div className="text-xs text-green-600 mt-1">
                  +{currentProgress.weightIncrease}kg
                </div>
              </div>
              <div className="bg-gray-50 rounded-lg p-3 text-center">
                <div className="text-2xl font-bold text-gray-700">
                  {currentProgress.currentReps}
                </div>
                <div className="text-sm text-gray-600">Reps hiện tại</div>
              </div>
              <div className="bg-primary-50 rounded-lg p-3 text-center">
                <div className="text-2xl font-bold text-primary-600">
                  {maxValues.maxWeight}kg
                </div>
                <div className="text-sm text-gray-600">Tạ cao nhất</div>
              </div>
              <div className="bg-gray-50 rounded-lg p-3 text-center">
                <div className="text-2xl font-bold text-gray-700">
                  {currentProgress.totalSessions}
                </div>
                <div className="text-sm text-gray-600">Buổi tập</div>
              </div>
            </div>
          </div>
        )}

        {/* Simple Progress Chart */}
        <div className="bg-white rounded-2xl shadow-lg p-4">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Biểu đồ tiến độ</h2>
          
          {progressData.length > 0 ? (
            <div className="space-y-4">
              {/* Weight Progress */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-700">Trọng lượng (kg)</span>
                  <span className="text-sm text-primary-600 font-medium">
                    {currentProgress?.currentWeight}kg
                  </span>
                </div>
                <div className="space-y-2">
                  {progressData.map((data, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <div className="text-xs text-gray-500 w-16">
                        {new Date(data.date).toLocaleDateString('vi-VN', { 
                          month: 'short',
                          day: 'numeric'
                        })}
                      </div>
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                          style={{ 
                            width: `${(data.weight / maxValues.maxWeight) * 100}%` 
                          }}
                        />
                      </div>
                      <div className="text-sm font-medium text-gray-800 w-12">
                        {data.weight}kg
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Progress Trend */}
              <div className="flex items-center justify-center space-x-2 p-3 bg-green-50 rounded-lg">
                <TrendingUp className="w-5 h-5 text-green-600" />
                <span className="text-sm text-green-800 font-medium">
                  Tiến độ tích cực - Tiếp tục phát huy!
                </span>
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <div className="text-4xl mb-4">📊</div>
              <p>Chưa có dữ liệu tiến độ</p>
              <p className="text-sm mt-2">Hãy tập luyện thêm để xem tiến độ!</p>
            </div>
          )}
        </div>

        {/* Goals Section */}
        <div className="bg-white rounded-2xl shadow-lg p-4">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Mục tiêu</h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-primary-50 rounded-lg">
              <div className="flex items-center">
                <Target className="w-5 h-5 text-primary-600 mr-3" />
                <div>
                  <div className="font-medium text-gray-800">Bench Press 80kg</div>
                  <div className="text-sm text-gray-600">Mục tiêu tháng này</div>
                </div>
              </div>
              <div className="text-primary-600 font-bold">87%</div>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center">
                <Target className="w-5 h-5 text-gray-400 mr-3" />
                <div>
                  <div className="font-medium text-gray-800">Squat 100kg</div>
                  <div className="text-sm text-gray-600">Mục tiêu quý này</div>
                </div>
              </div>
              <div className="text-gray-600 font-bold">65%</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
