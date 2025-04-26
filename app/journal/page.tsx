'use client';

import { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import {
  PlusCircle,
  Book,
  Calendar,
  Edit,
  Trash2,
  Loader2,
} from 'lucide-react';
import { JournalEntryClient } from '@/types';

export default function JournalPage() {
  const [journalEntries, setJournalEntries] = useState<JournalEntryClient[]>(
    [],
  );
  const [isCreating, setIsCreating] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchJournalEntries();
  }, []);

  const fetchJournalEntries = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/journal');

      if (!response.ok) {
        throw new Error('Failed to fetch journal entries');
      }

      const data = await response.json();

      // Format the dates from strings to Date objects
      const formattedEntries: JournalEntryClient[] = data.journalEntries.map(
        (entry: any) => ({
          ...entry,
          date: new Date(entry.date),
          createdAt: entry.createdAt ? new Date(entry.createdAt) : undefined,
          updatedAt: entry.updatedAt ? new Date(entry.updatedAt) : undefined,
        }),
      );

      setJournalEntries(formattedEntries);
    } catch (error) {
      console.error('Error fetching journal entries:', error);
      toast({
        title: 'Error',
        description: 'Failed to load your journal entries.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveEntry = async () => {
    if (!title.trim() || !content.trim()) {
      toast({
        title: 'Missing information',
        description:
          'Please provide both a title and content for your journal entry.',
        variant: 'destructive',
      });
      return;
    }

    setIsSaving(true);

    try {
      if (editingId) {
        // Update existing entry
        const response = await fetch(`/api/journal/${editingId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            title,
            content,
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to update journal entry');
        }

        await fetchJournalEntries();
        setEditingId(null);

        toast({
          title: 'Entry updated',
          description: 'Your journal entry has been updated.',
        });
      } else {
        // Create new entry
        const response = await fetch('/api/journal', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            title,
            content,
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to create journal entry');
        }

        await fetchJournalEntries();

        toast({
          title: 'Entry created',
          description: 'Your journal entry has been saved.',
        });
      }

      setTitle('');
      setContent('');
      setIsCreating(false);
    } catch (error) {
      console.error('Error saving journal entry:', error);
      toast({
        title: 'Error',
        description: 'Failed to save your journal entry. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleEditEntry = (entry: JournalEntryClient) => {
    setTitle(entry.title);
    setContent(entry.content);
    setEditingId(entry._id || null);
    setIsCreating(true);
  };

  const handleDeleteEntry = async (id: string) => {
    setIsDeleting(id);

    try {
      const response = await fetch(`/api/journal/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete journal entry');
      }

      // Remove from state to avoid re-fetching
      setJournalEntries(journalEntries.filter(entry => entry._id !== id));

      toast({
        title: 'Entry deleted',
        description: 'Your journal entry has been deleted.',
      });
    } catch (error) {
      console.error('Error deleting journal entry:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete your journal entry. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsDeleting(null);
    }
  };

  const handleCancel = () => {
    setTitle('');
    setContent('');
    setEditingId(null);
    setIsCreating(false);
  };

  return (
    <div className='container mx-auto max-w-4xl'>
      <div className='flex justify-between items-center mb-6'>
        <h1 className='text-2xl font-bold'>Journal</h1>
        {!isCreating && (
          <Button onClick={() => setIsCreating(true)}>
            <PlusCircle className='mr-2 h-4 w-4' />
            New Entry
          </Button>
        )}
      </div>

      {isCreating ? (
        <Card>
          <CardHeader>
            <CardTitle>
              {editingId ? 'Edit Entry' : 'New Journal Entry'}
            </CardTitle>
            <CardDescription>
              Express your thoughts and feelings in a safe, private space
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className='space-y-4'>
              <div>
                <label
                  htmlFor='title'
                  className='block text-sm font-medium mb-1'
                >
                  Title
                </label>
                <Input
                  id='title'
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  placeholder='Give your entry a title'
                />
              </div>

              <div>
                <label
                  htmlFor='content'
                  className='block text-sm font-medium mb-1'
                >
                  Journal Entry
                </label>
                <Textarea
                  id='content'
                  value={content}
                  onChange={e => setContent(e.target.value)}
                  placeholder='Write your thoughts here...'
                  className='min-h-[200px]'
                />
              </div>

              <div className='flex justify-end space-x-2'>
                <Button
                  variant='outline'
                  onClick={handleCancel}
                  disabled={isSaving}
                >
                  Cancel
                </Button>
                <Button onClick={handleSaveEntry} disabled={isSaving}>
                  {isSaving ? (
                    <>
                      <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                      {editingId ? 'Updating...' : 'Saving...'}
                    </>
                  ) : editingId ? (
                    'Update Entry'
                  ) : (
                    'Save Entry'
                  )}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : isLoading ? (
        <Card>
          <CardContent className='flex flex-col items-center justify-center py-12'>
            <Loader2 className='h-12 w-12 text-primary animate-spin mb-4' />
            <p className='text-muted-foreground'>
              Loading your journal entries...
            </p>
          </CardContent>
        </Card>
      ) : journalEntries.length > 0 ? (
        <div className='space-y-4'>
          {journalEntries.map(entry => (
            <Card key={entry._id}>
              <CardHeader className='pb-2'>
                <div className='flex justify-between items-start'>
                  <div>
                    <CardTitle>{entry.title}</CardTitle>
                    <CardDescription className='flex items-center mt-1'>
                      <Calendar className='mr-1 h-3 w-3' />
                      {new Date(entry.date).toLocaleDateString(undefined, {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </CardDescription>
                  </div>
                  <div className='flex space-x-1'>
                    <Button
                      variant='ghost'
                      size='icon'
                      onClick={() => handleEditEntry(entry)}
                      disabled={isDeleting !== null}
                    >
                      <Edit className='h-4 w-4' />
                    </Button>
                    <Button
                      variant='ghost'
                      size='icon'
                      onClick={() => handleDeleteEntry(entry._id as string)}
                      disabled={isDeleting !== null}
                    >
                      {isDeleting === entry._id ? (
                        <Loader2 className='h-4 w-4 animate-spin' />
                      ) : (
                        <Trash2 className='h-4 w-4' />
                      )}
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className='whitespace-pre-wrap'>{entry.content}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className='flex flex-col items-center justify-center py-12'>
            <Book className='h-12 w-12 text-muted-foreground mb-4' />
            <h3 className='text-lg font-medium mb-2'>No journal entries yet</h3>
            <p className='text-muted-foreground text-center mb-4'>
              Start writing your thoughts and feelings to track your mental
              wellbeing.
            </p>
            <Button onClick={() => setIsCreating(true)}>
              Create Your First Entry
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
