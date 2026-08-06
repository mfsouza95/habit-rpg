import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ActivityForm from '../src/components/ActivityForm';

function renderForm() {
  const onSubmitted = vi.fn();
  const setIsOpen = vi.fn();
  render(<ActivityForm setIsOpen={setIsOpen} onSubmitted={onSubmitted} />);
  return { onSubmitted, setIsOpen };
}

describe('ActivityForm', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('renders the category, activity and notes fields', () => {
    renderForm();

    expect(screen.getByLabelText('Category')).toBeInTheDocument();
    expect(screen.getByLabelText('Activity')).toBeInTheDocument();
    expect(screen.getByLabelText('Notes')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Submit' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Close' })).toBeInTheDocument();
  });

  it('starts from the empty entry constant', () => {
    renderForm();

    expect(screen.getByLabelText('Category')).toHaveValue('');
    expect(screen.getByLabelText('Activity')).toHaveValue('');
    expect(screen.getByLabelText('Notes')).toHaveValue('');
  });

  it('updates controlled state as the user types in any field', async () => {
    const user = userEvent.setup();
    renderForm();

    await user.type(screen.getByLabelText('Category'), 'Fitness');
    await user.type(screen.getByLabelText('Activity'), 'Run');
    await user.type(screen.getByLabelText('Notes'), 'morning run');

    expect(screen.getByLabelText('Category')).toHaveValue('Fitness');
    expect(screen.getByLabelText('Activity')).toHaveValue('Run');
    expect(screen.getByLabelText('Notes')).toHaveValue('morning run');
  });

  it('submits the entry as JSON to the activities endpoint on submit', async () => {
    const user = userEvent.setup();
    const fetchMock = vi.fn().mockResolvedValue({ ok: true, json: async () => ({ id: 1 }) });
    vi.stubGlobal('fetch', fetchMock);

    renderForm();
    await user.type(screen.getByLabelText('Category'), 'Fitness');
    await user.type(screen.getByLabelText('Activity'), 'Run');
    await user.type(screen.getByLabelText('Notes'), 'morning run');
    await user.click(screen.getByRole('button', { name: 'Submit' }));

    expect(fetchMock).toHaveBeenCalledTimes(1);
    const [submittedUrl, options] = fetchMock.mock.calls[0] as [string, RequestInit];
    expect(submittedUrl).toBe('http://localhost:3000/activities');
    expect(options.method).toBe('POST');
    expect(options.headers).toEqual({ 'Content-Type': 'application/json' });
    expect(JSON.parse(String(options.body))).toEqual({
      category: 'Fitness',
      activity: 'Run',
      note: 'morning run',
    });
  });

  it('reports the created record via onSubmitted and resets the form on success', async () => {
    const user = userEvent.setup();
    const created = { id: 7, category: 'Fitness', activity: 'Run', note: 'morning run', xpEarned: 150, timestamp: '2026-01-01T00:00:00.000Z' };
    const fetchMock = vi.fn().mockResolvedValue({ ok: true, json: async () => created });
    vi.stubGlobal('fetch', fetchMock);

    const { onSubmitted } = renderForm();
    await user.type(screen.getByLabelText('Category'), 'Fitness');
    await user.type(screen.getByLabelText('Activity'), 'Run');
    await user.type(screen.getByLabelText('Notes'), 'morning run');
    await user.click(screen.getByRole('button', { name: 'Submit' }));

    expect(onSubmitted).toHaveBeenCalledWith(created);
    expect(screen.getByLabelText('Category')).toHaveValue('');
    expect(screen.getByLabelText('Activity')).toHaveValue('');
    expect(screen.getByLabelText('Notes')).toHaveValue('');
  });

  it('surfaces an error message when the submission fails', async () => {
    const user = userEvent.setup();
    const fetchMock = vi.fn().mockResolvedValue({ ok: false, json: async () => ({}) });
    vi.stubGlobal('fetch', fetchMock);

    const { onSubmitted } = renderForm();
    await user.type(screen.getByLabelText('Category'), 'Fitness');
    await user.type(screen.getByLabelText('Activity'), 'Run');
    await user.click(screen.getByRole('button', { name: 'Submit' }));

    expect(screen.getByRole('alert')).toHaveTextContent('Could not submit activity');
    expect(onSubmitted).not.toHaveBeenCalled();
  });

  it('disables the submit button while the request is in flight', async () => {
    const user = userEvent.setup();
    let resolveFetch: (value: unknown) => void;
    const pending = new Promise((resolve) => {
      resolveFetch = resolve;
    });
    const fetchMock = vi.fn(() => pending);
    vi.stubGlobal('fetch', fetchMock);

    renderForm();
    await user.type(screen.getByLabelText('Category'), 'Fitness');
    await user.type(screen.getByLabelText('Activity'), 'Run');
    await user.click(screen.getByRole('button', { name: 'Submit' }));

    const submitButton = screen.getByRole('button', { name: 'Submit' });
    await waitFor(() => expect(submitButton).toBeDisabled());

    resolveFetch!({ ok: true, json: async () => ({}) });
    await waitFor(() => expect(submitButton).toBeEnabled());
  });

  it('closes the modal by calling setIsOpen(false)', async () => {
    const user = userEvent.setup();
    const { setIsOpen } = renderForm();

    await user.click(screen.getByRole('button', { name: 'Close' }));

    expect(setIsOpen).toHaveBeenCalledWith(false);
  });
});
