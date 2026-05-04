<?php

use Laravel\Fortify\Features;

return [
    'guard'     => 'web',
    'passwords' => 'users',
    'username'  => 'email',
    'email'     => 'email',
    'home'      => '/dashboard',

    'features' => [
        // Minimum setup: Only login/logout
    ],

    'limiters' => [
        'login' => 'login',
    ],
];
