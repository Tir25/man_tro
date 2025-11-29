#!/usr/bin/env node

delete process.env.__NEXT_PRIVATE_STANDALONE_CONFIG

process.argv = ['node', 'next', 'build', ...process.argv.slice(2)]

require('next/dist/bin/next')

