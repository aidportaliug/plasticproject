# plasticproject

Clone the repository:

```
git clone https://github.com/YOUR_USERNAME/plasticproject
cd plasticproject
```

Add the plasticproject repo as an upstream remote, so you can use it to sync your changes.

```
git remote add upstream https://github.com/aidportaliug/plasticproject.git
```

Create a branch where you will develop from:
```
git checkout -b name-of-change
```

Once you are satisfied with your change, create a commit as follows (how to write a commit message https://chris.beams.io/git-commit):

```
git add file1.py file2.py ...
git commit -m "Your commit message"
```

## Synchronize your repository with the upstream repository

```
git fetch upstream
git rebase upstream/main
```

Push the changes to the remote repository:

```
git push --set-upstream origin name-of-change
```