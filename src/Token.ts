function token ():string{

    const {Octokit, App, Action} = require('octokit');
    
    try{
        // Create a personal access token at https://github.com/settings/tokens/new?scopes=repo
        const octokit = new Octokit({ auth: `repo-token` });

        // Compare: https://docs.github.com/en/rest/reference/users#get-the-authenticated-user
        const {
            data: { login },
        } = await octokit.rest.users.getAuthenticated();
        console.log("Hello, %s", login);
    }
    return null;
}

export default token;