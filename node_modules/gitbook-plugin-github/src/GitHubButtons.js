const GitBook = require('gitbook-core');
const { React } = GitBook;

/**
 * Render button in toolbar for the GitHub repository.
 * @type {ReactClass}
 */
const GitHubButtons = React.createClass({
    propTypes: {
        url: React.PropTypes.string.isRequired
    },

    onOpen() {
        const { url } = this.props;
        window.open(url);
    },

    render() {
        return (
            <GitBook.ButtonGroup>
                <GitBook.Button title="GitHub" onClick={this.onOpen}>
                    <GitBook.Icon id="github" />
                </GitBook.Button>
            </GitBook.ButtonGroup>
        );
    }
});

module.exports = GitBook.connect(GitHubButtons, ({ config }) => ({
    url: config.getForPlugin('github').get('url')
}));
