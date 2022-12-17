module Jekyll
  module AssetFilter
	RegexpGithubCom = /^https?:\/\/(?:www\.)?github\.com\/([\w\d\-_.]+)\/([\w\d\-_.]+)\/?/;
	RegexpGithubIO = /^https?:\/\/([\w\d\-_.]+)\.github\.io\/([\w\d\-_.]+)\/?/;
	RegexpGitlabCom = /^https?:\/\/(?:www\.)?gitlab\.com\/([\w\d\-_.]+)\/([\w\d\-_.]+)\/?/;

    def createBadges(input)
      repoGithub = "#{input}".gsub(RegexpGithubCom,'\1/\2');
      repoGithubIO = "#{input}".gsub(RegexpGithubIO,'\1/\2');
      repoGitlab = "#{input}".gsub(RegexpGitlabCom,'\1/\2');

      if input != repoGithub
      	html = "<img src='https://badgen.net/github/stars/#{repoGithub}'' alt='' /><img src='https://badgen.net/github/last-commit/#{repoGithub}'' alt='' />"
      elsif input != repoGithubIO
      	html = "<img src='https://badgen.net/github/stars/#{repoGithubIO}'' alt='' /><img src='https://badgen.net/github/last-commit/#{repoGithubIO}'' alt='' />"
      elsif input != repoGitlab
      	html = "<img src='https://badgen.net/gitlab/stars/#{repoGitlab}'' alt='' /><img src='https://badgen.net/gitlab/last-commit/#{repoGitlab}'' alt='' />"
      end

      "#{html}"
    end
  end
end

Liquid::Template.register_filter(Jekyll::AssetFilter)
