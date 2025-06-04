const GitBook = require('gitbook-core');
const GitHubButtons = require('./GitHubButtons');

module.exports = GitBook.createPlugin({
    activate: (dispatch, getState, { Components }) => {
        dispatch(Components.registerComponent(GitHubButtons, { role: 'toolbar:buttons:right' }));
    }
});
