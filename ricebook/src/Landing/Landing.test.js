import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Landing from './Landing';

test('should log in a previously registered user (not new users, login state should be set)', () => {
    const mockUsers = [
        {
            username: 'Bret',
            password: 'Kulas Light',
        },
    ];

    global.fetch = jest.fn(() =>
        Promise.resolve({
            json: () => Promise.resolve(mockUsers),
        })
    );

    render(<Landing />);

    fireEvent.change(screen.getByTestId('accountNameInput'), {
        target: { value: 'Bret' },
    });
    fireEvent.change(screen.getByTestId('passwordInput'), {
        target: { value: 'Kulas Light' },
    });
    fireEvent.click(screen.getByTestId('loginButton'));

    expect(localStorage.getItem('user')).toEqual(JSON.stringify(mockUsers[0]));
});

test('should not log in an invalid user (error state should be set)', () => {

    const mockUsers = [
        {
            username: 'testuser',
            address: { street: 'testpassword' },
        },
    ];

    global.fetch = jest.fn(() =>
        Promise.resolve({
            json: () => Promise.resolve(mockUsers),
        })
    );

    render(<Landing />);

    fireEvent.change(screen.getByTestId('accountNameInput'), {
        target: { value: 'invaliduser' },
    });
    fireEvent.change(screen.getByTestId('passwordInput'), {
        target: { value: 'invalidpassword' },
    });
    fireEvent.click(screen.getByTestId('loginButton'));

    expect(screen.getByText('Invalid credentials')).toBeInTheDocument();
});

test('should log out a user (login state should be cleared)', () => {
    localStorage.setItem(
        'user',
        JSON.stringify({
            username: 'testuser',
            address: { street: 'testpassword' },
        })
    );

    render(<Landing />);

    fireEvent.click(screen.getByTestId('logoutButton'));

    expect(localStorage.getItem('user')).toBeNull();
});
