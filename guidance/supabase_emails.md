# Professionalizing Supabase Auth Emails

To provide a premium experience, you should update the default Supabase email templates in your [Supabase Dashboard](https://supabase.com/dashboard/project/_/auth/templates).

## 1. Confirmation / Signup Email
**Subject**: 👋 Welcome to CheckBeforeCommit - Let's Analyze Your First Repo

**Body (HTML)**:
```html
<div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 40px; border: 1px solid #eee; border-radius: 20px;">
  <h2 style="color: #1a1a1a; font-size: 24px;">Welcome to CheckBeforeCommit</h2>
  <p style="color: #666; line-height: 1.6;">You're one step away from mastering technical complexity. Confirm your email to start analyzing any GitHub repository in minutes.</p>
  <div style="margin: 40px 0;">
    <a href="{{ .ConfirmationURL }}" style="background: #FF782D; color: white; padding: 14px 28px; text-decoration: none; border-radius: 12px; font-weight: bold; font-size: 14px;">Confirm Your Email</a>
  </div>
  <p style="color: #999; font-size: 12px;">This link will expire in 24 hours.</p>
</div>
```

## 2. Password Reset
**Subject**: 🛡️ Reset Your CheckBeforeCommit Password

**Body (HTML)**:
```html
<div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 40px; border: 1px solid #eee; border-radius: 20px;">
  <h2 style="color: #1a1a1a; font-size: 24px;">Password Reset Requested</h2>
  <p style="color: #666; line-height: 1.6;">We received a request to reset your password. Click the button below to choose a new one. If you didn't request this, you can safely ignore this email.</p>
  <div style="margin: 40px 0;">
    <a href="{{ .ConfirmationURL }}" style="background: #1a1a1a; color: white; padding: 14px 28px; text-decoration: none; border-radius: 12px; font-weight: bold; font-size: 14px;">Reset Password</a>
  </div>
</div>
```

## 3. Deployment Steps
1. Navigate to **Authentication > Email Templates**.
2. Copy the HTML above into the corresponding template fields.
3. Use a custom SMTP provider (like Resend or Postmark) for better deliverability if you're on a Pro Supabase plan.
