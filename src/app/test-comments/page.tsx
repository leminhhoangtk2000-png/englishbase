'use client'

import { UniversalComments } from '@/components/universal-comments'

export default function TestCommentsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Test Comments Page</h1>
      
      <div className="prose max-w-none mb-8">
        <p>This is a test page to verify the comment system is working correctly.</p>
        <p>The comment system should:</p>
        <ul>
          <li>Show login/signup buttons for anonymous users</li>
          <li>Allow authenticated users to post comments</li>
          <li>Support nested replies</li>
          <li>Redirect users back to this page after login</li>
        </ul>
      </div>

      <div className="border-t pt-8">
        <UniversalComments pageId="test-comments-page" />
      </div>
    </div>
  )
}
