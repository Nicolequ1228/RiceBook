import React from 'react';
import { render, screen } from '@testing-library/react';
import Profile from './Profile';

const mockLocalStorage = {
    getItem: jest.fn().mockReturnValue(JSON.stringify({ username: 'testuser' })),
};
global.localStorage = mockLocalStorage;

test('should fetch the logged in user\'s profile username', () => {
    render(<Profile />);

    const usernameElement = screen.getByText('Account name');
    const usernameValue = screen.getByText('testuser');

    expect(usernameElement).toBeInTheDocument();
    expect(usernameValue).toBeInTheDocument();
});
