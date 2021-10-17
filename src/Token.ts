/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable no-unsafe-finally */
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
        const retrieve = require('./OctokitAppServer.ts');
        retrieve();
        return octokit.toString('leaflet-secret');
    }finally{
        // return null;
        throw new Exception('retieve token GitHub error');
    }
    
}

export default token;