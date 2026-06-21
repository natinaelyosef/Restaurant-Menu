<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Welcome to {{ config('app.name', 'BestBuy Restaurant') }}</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background-color: #f3f4f6;
            margin: 0;
            padding: 0;
            color: #1f2937;
        }
        .container {
            max-width: 600px;
            margin: 40px auto;
            background-color: #ffffff;
            border-radius: 12px;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
            overflow: hidden;
            border: 1px solid #e5e7eb;
        }
        .header {
            background-color: #3b82f6;
            background-image: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
            padding: 32px;
            text-align: center;
            color: #ffffff;
        }
        .header h1 {
            margin: 0;
            font-size: 28px;
            font-weight: 700;
        }
        .content {
            padding: 32px;
            line-height: 1.6;
        }
        .content h2 {
            color: #111827;
            font-size: 20px;
            margin-top: 0;
        }
        .button-wrapper {
            text-align: center;
            margin: 32px 0;
        }
        .button {
            display: inline-block;
            padding: 12px 24px;
            background-color: #3b82f6;
            color: #ffffff !important;
            text-decoration: none;
            border-radius: 6px;
            font-weight: 600;
            box-shadow: 0 2px 4px rgba(59, 130, 246, 0.3);
            transition: background-color 0.2s;
        }
        .button:hover {
            background-color: #2563eb;
        }
        .footer {
            background-color: #f9fafb;
            padding: 24px;
            text-align: center;
            font-size: 13px;
            color: #6b7280;
            border-top: 1px solid #e5e7eb;
        }
        .footer a {
            color: #3b82f6;
            text-decoration: none;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🍔 Welcome to {{ config('app.name', 'BestBuy Restaurant') }}!</h1>
        </div>
        <div class="content">
            <h2>Hello, {{ $user->name }}!</h2>
            <p>Thank you for creating an account with us. We are absolutely thrilled to welcome you to our community!</p>
            <p>Your account (<strong>{{ $user->email }}</strong>) has been successfully created. You can now log in, make table reservations, browse our menu, and check today's chef specials.</p>
            
            <div class="button-wrapper">
                <a href="{{ url('/') }}" class="button">Visit Our Restaurant</a>
            </div>
            
            <p>If you have any questions or need assistance, feel free to contact our support team at any time.</p>
            <p>Best regards,<br>The {{ config('app.name', 'BestBuy Restaurant') }} Team</p>
        </div>
        <div class="footer">
            <p>&copy; {{ date('Y') }} {{ config('app.name', 'BestBuy Restaurant') }}. All rights reserved.</p>
            <p>If you did not sign up for this account, please ignore this email.</p>
        </div>
    </div>
</body>
</html>
