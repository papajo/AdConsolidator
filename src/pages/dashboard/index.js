import { useState } from 'react';
import Head from 'next/head';
import { useUser, SignOutButton } from '@clerk/nextjs';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

export default function Dashboard() {
  const { isSignedIn, user, isLoaded } = useUser();
  const [activeTab, setActiveTab] = useState('my-ads');

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-3 border-brand-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!isSignedIn) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header onSearch={() => {}} onCategoryChange={() => {}} activeCategory="All" />
        <main className="flex-1 flex items-center justify-center px-4 py-20">
          <div className="text-center">
            <div className="w-20 h-20 rounded-full bg-surface-100 flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-surface-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h1 className="font-display text-3xl text-surface-900 mb-3">Sign in required</h1>
            <p className="text-surface-500 mb-6">Please sign in to access your dashboard.</p>
            <a href="/sign-in" className="btn-primary inline-block">Sign In</a>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const tabs = [
    { id: 'overview', label: 'Overview', icon: '📊' },
    { id: 'my-ads', label: 'My Ads', icon: '📋' },
    { id: 'saved', label: 'Saved Searches', icon: '🔖' },
    { id: 'alerts', label: 'Alerts', icon: '🔔' },
    { id: 'settings', label: 'Settings', icon: '⚙️' },
    { id: 'billing', label: 'Billing', icon: '💳' },
  ];

  const myAds = [
    { id: 1, title: 'Pro XYZT License - Enterprise', status: 'approved', views: 342, inquiries: 12, date: '2026-05-28' },
    { id: 2, title: 'Consulting Services - XY/Z/T Expert', status: 'pending', views: 0, inquiries: 0, date: '2026-05-30' },
  ];

  const savedSearches = [
    { id: 1, query: 'XYZT enterprise license', category: 'Products', created: '2026-05-15' },
    { id: 2, query: 'consulting services', category: 'Services', created: '2026-05-20' },
  ];

  const alerts = [
    { id: 1, keyword: 'enterprise', active: true, frequency: 'Daily' },
    { id: 2, keyword: 'consulting', active: true, frequency: 'Weekly' },
  ];

  return (
    <>
      <Head>
        <title>Dashboard | XYZT Ad Consolidator</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div className="min-h-screen flex flex-col">
        <Header onSearch={() => {}} onCategoryChange={() => {}} activeCategory="All" />

        <main className="flex-1">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-20">
            {/* Welcome header */}
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-brand-300 to-brand-600 flex items-center justify-center">
                  <span className="text-white font-bold text-lg">
                    {(user?.firstName?.[0] || 'U')}{user?.lastName?.[0] || ''}
                  </span>
                </div>
                <div>
                  <h1 className="font-display text-2xl md:text-3xl text-surface-900">
                    Welcome back, {user?.firstName || 'there'}
                  </h1>
                  <p className="text-sm text-surface-500">{user?.primaryEmailAddress?.emailAddress}</p>
                </div>
              </div>
              <SignOutButton>
                <button className="btn-secondary text-sm">Sign Out</button>
              </SignOutButton>
            </div>

            {/* Quick stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              {[
                { label: 'Total Views', value: '432', change: '+12%', up: true },
                { label: 'Inquiries', value: '18', change: '+5', up: true },
                { label: 'Active Ads', value: '2', change: '1 pending', up: null },
                { label: 'Avg Response', value: '2.1h', change: '-0.3h', up: true },
              ].map(stat => (
                <div key={stat.label} className="glass-card rounded-2xl p-5">
                  <p className="text-xs text-surface-500 mb-1">{stat.label}</p>
                  <div className="flex items-end justify-between">
                    <span className="font-display text-2xl text-surface-900">{stat.value}</span>
                    <span className={`text-xs font-medium ${stat.up === true ? 'text-emerald-600' : stat.up === false ? 'text-red-500' : 'text-surface-400'}`}>
                      {stat.change}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Tabs + Content */}
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Sidebar tabs */}
              <nav className="lg:w-56 flex-shrink-0">
                <div className="glass-card rounded-2xl p-2 space-y-1">
                  {tabs.map(tab => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200
                        ${activeTab === tab.id
                          ? 'bg-brand-500 text-white shadow-md shadow-brand-500/20'
                          : 'text-surface-600 hover:bg-surface-100'
                        }`}
                    >
                      <span>{tab.icon}</span>
                      {tab.label}
                    </button>
                  ))}
                </div>
              </nav>

              {/* Content */}
              <div className="flex-1 min-w-0">
                {/* Overview */}
                {activeTab === 'overview' && (
                  <div className="space-y-6">
                    <div className="glass-card rounded-3xl p-6">
                      <h3 className="font-display text-lg text-surface-900 mb-4">Recent Activity</h3>
                      <div className="space-y-4">
                        {[
                          { action: 'New inquiry on your ad', detail: '"Pro XYZT License" — from john@example.com', time: '2 hours ago', icon: '📧' },
                          { action: 'Ad approved', detail: '"Pro XYZT License" is now live', time: '3 hours ago', icon: '✅' },
                          { action: 'Ad submitted', detail: '"Consulting Services" is pending review', time: '1 day ago', icon: '📤' },
                          { action: 'Account created', detail: 'Welcome to XYZT Ad Consolidator!', time: '2 days ago', icon: '🎉' },
                        ].map((item, i) => (
                          <div key={i} className="flex items-start gap-4 pb-4 border-b border-surface-100 last:border-0 last:pb-0">
                            <div className="w-8 h-8 rounded-lg bg-surface-50 flex items-center justify-center flex-shrink-0 text-sm">{item.icon}</div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-surface-800">{item.action}</p>
                              <p className="text-xs text-surface-500 truncate">{item.detail}</p>
                            </div>
                            <span className="text-xs text-surface-400 flex-shrink-0">{item.time}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="glass-card rounded-3xl p-6">
                        <h3 className="font-display text-lg text-surface-900 mb-3">Performance</h3>
                        <div className="h-32 flex items-end gap-2">
                          {[40, 65, 30, 80, 55, 90, 70].map((h, i) => (
                            <div key={i} className="flex-1 bg-brand-500/80 rounded-t-lg hover:bg-brand-500 transition-colors" style={{ height: `${h}%` }} />
                          ))}
                        </div>
                        <p className="text-xs text-surface-400 mt-2 text-center">Last 7 days</p>
                      </div>

                      <div className="glass-card rounded-3xl p-6">
                        <h3 className="font-display text-lg text-surface-900 mb-3">Top Sources</h3>
                        <div className="space-y-3">
                          {[
                            { src: 'Direct', pct: 45 },
                            { src: 'Google', pct: 30 },
                            { src: 'Social', pct: 15 },
                            { src: 'Referral', pct: 10 },
                          ].map(s => (
                            <div key={s.src}>
                              <div className="flex justify-between text-xs mb-1">
                                <span className="text-surface-600">{s.src}</span>
                                <span className="text-surface-400">{s.pct}%</span>
                              </div>
                              <div className="h-1.5 bg-surface-100 rounded-full overflow-hidden">
                                <div className="h-full bg-gradient-to-r from-brand-500 to-brand-400 rounded-full" style={{ width: `${s.pct}%` }} />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* My Ads */}
                {activeTab === 'my-ads' && (
                  <div className="glass-card rounded-3xl p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-display text-lg text-surface-900">My Advertisements</h3>
                      <a href="/submit-ad" className="btn-primary text-sm py-2 px-4">+ New Ad</a>
                    </div>
                    <div className="space-y-3">
                      {myAds.map(ad => (
                        <div key={ad.id} className="flex items-center justify-between p-4 bg-surface-50 rounded-2xl">
                          <div>
                            <h4 className="text-sm font-medium text-surface-900">{ad.title}</h4>
                            <div className="flex items-center gap-3 mt-1">
                              <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                                ad.status === 'approved' ? 'bg-emerald-100 text-emerald-700' :
                                ad.status === 'pending' ? 'bg-amber-100 text-amber-700' :
                                'bg-red-100 text-red-700'
                              }`}>
                                {ad.status}
                              </span>
                              <span className="text-xs text-surface-400">{ad.date}</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-4">
                            <div className="text-right">
                              <p className="text-xs text-surface-500">{ad.views} views</p>
                              <p className="text-xs text-surface-400">{ad.inquiries} inquiries</p>
                            </div>
                            <button className="text-xs text-brand-600 hover:text-brand-700 font-medium">Edit</button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Saved Searches */}
                {activeTab === 'saved' && (
                  <div className="glass-card rounded-3xl p-6">
                    <h3 className="font-display text-lg text-surface-900 mb-4">Saved Searches</h3>
                    {savedSearches.length === 0 ? (
                      <p className="text-sm text-surface-500 text-center py-8">No saved searches yet. Search and click "Save" to create one.</p>
                    ) : (
                      <div className="space-y-3">
                        {savedSearches.map(search => (
                          <div key={search.id} className="flex items-center justify-between p-4 bg-surface-50 rounded-2xl">
                            <div>
                              <p className="text-sm font-medium text-surface-900">"{search.query}"</p>
                              <p className="text-xs text-surface-400 mt-0.5">in {search.category} · saved {search.created}</p>
                            </div>
                            <button className="text-xs text-brand-600 hover:text-brand-700 font-medium">Run</button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Alerts */}
                {activeTab === 'alerts' && (
                  <div className="space-y-6">
                    <div className="glass-card rounded-3xl p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-display text-lg text-surface-900">Email Alerts</h3>
                        <button className="btn-primary text-sm py-2 px-4">+ New Alert</button>
                      </div>
                      <div className="space-y-3">
                        {alerts.map(alert => (
                          <div key={alert.id} className="flex items-center justify-between p-4 bg-surface-50 rounded-2xl">
                            <div className="flex items-center gap-3">
                              <div className={`w-10 h-6 rounded-full transition-colors ${alert.active ? 'bg-brand-500' : 'bg-surface-200'}`}>
                                <div className={`w-4 h-4 bg-white rounded-full shadow-sm transform transition-transform ${alert.active ? 'translate-x-5' : 'translate-x-1'} mt-1`} />
                              </div>
                              <div>
                                <p className="text-sm font-medium text-surface-900">"{alert.keyword}"</p>
                                <p className="text-xs text-surface-400">{alert.frequency} digest</p>
                              </div>
                            </div>
                            <button className="text-xs text-surface-500 hover:text-surface-700">Edit</button>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="glass-card rounded-3xl p-6">
                      <h3 className="font-display text-lg text-surface-900 mb-3">Push Notifications</h3>
                      <p className="text-sm text-surface-500 mb-4">Get instant alerts in your browser when new ads match your criteria.</p>
                      <button className="btn-secondary text-sm">Enable Notifications</button>
                    </div>
                  </div>
                )}

                {/* Settings */}
                {activeTab === 'settings' && (
                  <div className="space-y-6">
                    <div className="glass-card rounded-3xl p-6">
                      <h3 className="font-display text-lg text-surface-900 mb-4">Account Settings</h3>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-surface-700 mb-1">First Name</label>
                          <input type="text" className="input-field" defaultValue={user?.firstName || ''} />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-surface-700 mb-1">Last Name</label>
                          <input type="text" className="input-field" defaultValue={user?.lastName || ''} />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-surface-700 mb-1">Email</label>
                          <input type="email" className="input-field bg-surface-100" defaultValue={user?.primaryEmailAddress?.emailAddress || ''} disabled />
                        </div>
                        <button className="btn-primary text-sm">Save Changes</button>
                      </div>
                    </div>

                    <div className="glass-card rounded-3xl p-6">
                      <h3 className="font-display text-lg text-surface-900 mb-3">Danger Zone</h3>
                      <p className="text-sm text-surface-500 mb-4">Once you delete your account, there is no going back.</p>
                      <button className="text-sm font-medium text-red-600 hover:text-red-700 bg-red-50 px-4 py-2 rounded-xl transition-colors">Delete Account</button>
                    </div>
                  </div>
                )}

                {/* Billing */}
                {activeTab === 'billing' && (
                  <div className="space-y-6">
                    <div className="glass-card rounded-3xl p-6">
                      <h3 className="font-display text-lg text-surface-900 mb-2">Current Plan: Free</h3>
                      <p className="text-sm text-surface-500 mb-4">You're on the Starter plan. Upgrade to unlock more features.</p>
                      <div className="flex gap-3">
                        <a href="/pricing" className="btn-primary text-sm">Upgrade Plan</a>
                      </div>
                    </div>

                    <div className="glass-card rounded-3xl p-6">
                      <h3 className="font-display text-lg text-surface-900 mb-4">Payment History</h3>
                      <p className="text-sm text-surface-500 text-center py-8">No payment history yet.</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
}
