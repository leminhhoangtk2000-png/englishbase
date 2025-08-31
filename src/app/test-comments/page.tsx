"use client"

import React from 'react';
import CommentSystem from '@/components/exercises/CommentSystem';

export default function TestCommentsPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">
            Test Comment System
          </h1>
          
          <div className="prose max-w-none mb-8">
            <p className="text-lg text-gray-700 leading-relaxed">
              Đây là trang test để kiểm tra comment system mới đã được chuyển đổi từ hệ thống "likes" sang "claps" 
              giống như trong phần blog-new. System này bao gồm:
            </p>
            
            <ul className="mt-4 space-y-2 text-gray-600">
              <li>• Giao diện mới với Hand icon thay vì ThumbsUp</li>
              <li>• Hệ thống "claps" thay vì "likes"</li>
              <li>• Layout sạch sẽ hơn giống blog-new</li>
              <li>• Chức năng reply và nested comments</li>
              <li>• Animation và responsive design</li>
            </ul>
            
            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <p className="text-blue-800 font-medium">
                💡 Bạn có thể test các tính năng sau:
              </p>
              <ul className="mt-2 space-y-1 text-blue-700">
                <li>• Viết comment mới</li>
                <li>• Clap (👏) các comment</li>
                <li>• Reply comment</li>
                <li>• Xem nested replies</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Comment System Test */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="p-6 border-b">
            <h2 className="text-xl font-semibold text-gray-900">
              Comment System Demo
            </h2>
            <p className="text-gray-600 mt-1">
              Test comment system với mock data và các tính năng đầy đủ
            </p>
          </div>
          
          <div className="p-6">
            <CommentSystem 
              exerciseId="test-exercise-123"
            />
          </div>
        </div>
        
        <div className="mt-8 text-center text-gray-500">
          <p>Test page - Comment system với claps thay vì likes</p>
        </div>
      </div>
    </div>
  );
}
