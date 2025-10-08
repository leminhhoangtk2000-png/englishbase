import { NextRequest, NextResponse } from 'next/server';

// In-memory storage for demo purposes
// In production, you'd want to store these in a database
let userWebhooks = {
  premiumWebhook: '',
  newUserWebhook: ''
};

export async function GET() {
  try {
    return NextResponse.json(userWebhooks);
  } catch (error) {
    console.error('Error fetching user webhooks:', error);
    return NextResponse.json(
      { error: 'Failed to fetch user webhooks' }, 
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { type, url }: { type: 'premium' | 'newUser', url: string } = await request.json();
    
    if (!type || !url) {
      return NextResponse.json(
        { error: 'Missing type or url' }, 
        { status: 400 }
      );
    }

    if (type === 'premium') {
      userWebhooks.premiumWebhook = url;
    } else if (type === 'newUser') {
      userWebhooks.newUserWebhook = url;
    } else {
      return NextResponse.json(
        { error: 'Invalid webhook type' }, 
        { status: 400 }
      );
    }

    return NextResponse.json({ 
      success: true, 
      message: `${type} webhook saved successfully` 
    });
  } catch (error) {
    console.error('Error saving user webhook:', error);
    return NextResponse.json(
      { error: 'Failed to save user webhook' }, 
      { status: 500 }
    );
  }
}
