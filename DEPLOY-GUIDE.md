# Navia — Deploy to Vercel + Namecheap DNS

Follow these steps to put bynavia.com live. Total time: ~10 minutes.

---

## Step 1: Create a Vercel account

1. Go to [vercel.com](https://vercel.com)
2. Click **Sign Up** → sign up with your email (or GitHub if you have one)
3. Free plan is perfect — no credit card needed

## Step 2: Prepare your project folder

Make sure your Navia folder contains at least:

```
navia-landing.html  →  rename to index.html
```

**Important:** Rename `navia-landing.html` to `index.html` — this is how web servers know it's the homepage.

Your folder should look like this:

```
Navia/
├── index.html          (your landing page)
├── og-image.png        (when ready)
├── logo.png            (when ready)
├── founder.jpg         (when ready)
└── favicon.ico         (when ready)
```

## Step 3: Deploy to Vercel

### Option A: Drag & Drop (easiest, no GitHub needed)

1. Go to [vercel.com/new](https://vercel.com/new)
2. Scroll down to **"Import Third-Party Git Repository"** — skip this
3. Instead, look for **"Or, drop your files here"** at the bottom
4. Drag your entire Navia folder into the browser
5. Vercel will automatically detect it's a static site
6. Click **Deploy**
7. In ~30 seconds, you'll get a URL like `navia-xxxxx.vercel.app`
8. Test it — your site is live!

### Option B: Via GitHub (better for ongoing updates)

1. Create a GitHub account if you don't have one: [github.com](https://github.com)
2. Create a new repository called `navia-landing`
3. Upload your files (index.html + images)
4. In Vercel, click **Import Project** → select your GitHub repo
5. Click **Deploy**
6. Every time you push to GitHub, Vercel will auto-redeploy

## Step 4: Connect your domain (bynavia.com)

### In Vercel:

1. Go to your project dashboard in Vercel
2. Click **Settings** → **Domains**
3. Type `bynavia.com` and click **Add**
4. Vercel will show you DNS records to configure

### In Namecheap:

1. Log in to [namecheap.com](https://namecheap.com)
2. Go to **Domain List** → click **Manage** next to bynavia.com
3. Click **Advanced DNS**
4. Add the following records (replace existing A records if any):

| Type    | Host | Value              | TTL       |
|---------|------|--------------------|-----------|
| A       | @    | 76.76.21.21        | Automatic |
| CNAME   | www  | cname.vercel-dns.com | Automatic |

5. **Delete** any conflicting A records or CNAME records for @ or www
6. Save changes

### Wait for propagation:

- DNS changes take 5–30 minutes (sometimes up to 48h, but usually fast)
- Vercel will automatically issue an SSL certificate once DNS propagates
- You can check status at [dnschecker.org](https://dnschecker.org/#A/bynavia.com)

## Step 5: Verify everything works

Once DNS propagates, test these URLs:

- [ ] `https://bynavia.com` — should show your landing page
- [ ] `https://www.bynavia.com` — should redirect to above
- [ ] `http://bynavia.com` — should auto-redirect to https
- [ ] Check the padlock icon 🔒 in the browser (SSL active)

## Step 6: Test social sharing

After your OG image is uploaded, test your social preview:

- [LinkedIn Post Inspector](https://www.linkedin.com/post-inspector/)
- [Twitter Card Validator](https://cards-dev.twitter.com/validator)
- [Facebook Sharing Debugger](https://developers.facebook.com/tools/debug/)

Paste `https://bynavia.com` and check that the image, title, and description appear correctly.

---

## Updating the site later

### If you used drag & drop:
Re-upload the entire folder to Vercel (same project)

### If you used GitHub:
Just push your changes — Vercel auto-deploys within seconds

---

## Troubleshooting

**Site not loading after DNS change?**
→ Wait 30 min, then check dnschecker.org. Clear your browser cache.

**SSL certificate not working?**
→ Vercel issues it automatically. If it's been over 1 hour, check that DNS records are correct in Namecheap.

**OG image not showing on social?**
→ Use the debugger tools above. LinkedIn and Facebook cache old previews — the debugger forces a refresh.

---

*Need help? Just ask in our next session.*
