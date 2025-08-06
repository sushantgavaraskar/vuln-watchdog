import { useEffect, useState } from 'react';
import { MainLayout } from '@/components/layout/main-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { apiClient } from '@/lib/api';

export default function UserProfile() {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ name: '', email: '' });
  const { toast } = useToast();

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      try {
        const data = await apiClient.getUserProfile();
        setProfile(data);
        setForm({ name: data.name || '', email: data.email || '' });
      } catch (error) {
        toast({ title: 'Error', description: 'Failed to fetch profile', variant: 'destructive' });
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [toast]);

  const handleUpdate = async () => {
    setEditing(true);
    try {
      await apiClient.updateUserProfile(form);
      toast({ title: 'Success', description: 'Profile updated' });
      setProfile({ ...profile, ...form });
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to update profile', variant: 'destructive' });
    } finally {
      setEditing(false);
    }
  };

  return (
    <MainLayout>
      <div className="max-w-xl mx-auto py-8">
        <Card className="bg-gradient-card border-security">
          <CardHeader>
            <CardTitle className="text-foreground">User Profile</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="py-8 text-center">Loading...</div>
            ) : profile ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Name</label>
                  <Input
                    value={form.name}
                    onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                    disabled={editing}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Email</label>
                  <Input
                    value={form.email}
                    onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                    disabled={editing}
                  />
                </div>
                <Button onClick={handleUpdate} disabled={editing}>
                  {editing ? 'Updating...' : 'Update Profile'}
                </Button>
              </div>
            ) : (
              <div className="py-8 text-center">Profile not found</div>
            )}
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}