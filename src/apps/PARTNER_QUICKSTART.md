# Partner Dashboard Quick Start Guide

## Accessing the Partner Portal

### Method 1: From Admin Dashboard
1. Navigate to Admin Dashboard (`/admin`)
2. Click on user avatar (top-right corner)
3. Select **"Partner Portal"** from dropdown menu
4. Portal will load with full partner interface

### Method 2: Direct URL
- Navigate directly to: `[your-domain]/partner-dashboard`
- Portal loads immediately

### Method 3: From Website
- Add a "Partner Login" button to main website
- Route to: `router.navigate({ page: 'partner-dashboard' })`

## Navigation Overview

### Top Navigation Bar (Desktop)
All main sections visible in horizontal tabs:
- **Home** - Dashboard overview
- **Find work** - Browse available jobs
- **My work** - Manage accepted jobs  
- **Reservations** - View bookings
- **Messages** - Communications
- **Routes** - Daily routes
- **Profile** - Personal settings
- **Payments** - Earnings
- **Support** - Help centre

### Mobile Navigation
- Tap hamburger menu (☰) for drawer
- All sections accessible in sidebar
- Swipe left to close

## Key Features to Test

### 1. Home Dashboard
✓ View earnings statistics  
✓ Check upcoming jobs  
✓ See performance metrics  
✓ Quick actions available

### 2. Find Work
✓ Browse available jobs  
✓ Filter by job type  
✓ Search by location  
✓ Express interest in jobs

### 3. My Work
✓ View active jobs  
✓ Track job progress  
✓ Contact customers  
✓ Update job status

### 4. Messages
✓ Send/receive messages  
✓ View conversation history  
✓ See online status  
✓ Attach files

### 5. Routes
✓ View daily route  
✓ See all stops  
✓ Get navigation  
✓ Optimize route

### 6. Profile
✓ Edit personal info  
✓ Update vehicle details  
✓ Verify documents  
✓ View statistics

### 7. Payments
✓ Check earnings  
✓ View transactions  
✓ See payment schedule  
✓ Export data

### 8. Support
✓ Search help articles  
✓ View FAQs  
✓ Contact support  
✓ Create tickets

## User Menu Options

Click avatar in top-right:
- **Profile** - Jump to profile page
- **Partner Portal** - (when in admin)
- **Exit to Website** - Return to main site
- **Exit portal** - (when in partner)
- **Log out** - End session

## Responsive Design Testing

### Mobile (< 640px)
- Single column layout
- Drawer navigation
- Stacked cards
- Touch-friendly buttons

### Tablet (640px - 1024px)  
- Two column layout
- Visible tabs (scrollable)
- Optimized spacing

### Desktop (> 1024px)
- Full horizontal navigation
- Multi-column grids
- Expanded content

## Quick Testing Checklist

- [ ] Dashboard loads without errors
- [ ] All navigation items work
- [ ] Mobile menu opens/closes
- [ ] Search bar functions
- [ ] User menu displays
- [ ] All pages load content
- [ ] Responsive on mobile
- [ ] Responsive on tablet
- [ ] Icons render correctly
- [ ] Colors match branding
- [ ] Buttons are clickable
- [ ] Empty states show
- [ ] Loading states work

## Common Issues & Solutions

### Issue: Page not loading
**Solution**: Check console for lazy loading errors

### Issue: Navigation not working
**Solution**: Verify router setup in AppRouter.tsx

### Issue: Styling looks broken
**Solution**: Ensure Tailwind CSS is properly configured

### Issue: Icons missing
**Solution**: Check Lucide React is installed

### Issue: Mobile menu stuck open
**Solution**: Tap overlay area to close

## Demo Data

The dashboard includes sample data for testing:

**Jobs**: JOB-2401, JOB-2402, JOB-2403  
**Earnings**: £3,250 this month  
**Rating**: 4.6/5.0  
**Completed**: 28 jobs  

All data is static for demo purposes. Replace with API calls for production.

## Next Steps

1. **Backend Integration**
   - Connect to real job API
   - Implement authentication
   - Add payment processing

2. **Real-time Features**
   - WebSocket for live updates
   - Push notifications
   - Live chat functionality

3. **Advanced Features**
   - Calendar sync
   - GPS tracking
   - Document upload
   - Payment integration

## Support

For technical issues or questions:
- Email: dev@shiftmyhome.com
- Slack: #partner-dashboard
- Docs: /docs/partner-portal.md

---

**Version**: 1.0.0  
**Last Updated**: January 15, 2026
