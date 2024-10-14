# MBot Scratch Virtual Machine
The MBot Scratch VM is a fork of the [Scratch Foundation VM](https://github.com/scratchfoundation/scratch-vm/), which is a library for representing, running, and maintaining the state of computer programs written using [Scratch Blocks](https://github.com/scratchfoundation/scratch-blocks).

## Installation
To install the MBot Scratch VM, run the following commands. This will install [`npm`](https://docs.npmjs.com/about-npm) and [`Node.js`](https://nodejs.org/en/about) if it is not already installed on the system. 
```bash
./install_scripts/install.sh
```

## Development Notes
The original Scratch GUI and Scratch VM repositories receive about 100 commits per week because of dependency bot updates. This leads to Scratch creating several new releases of the VM and GUI *every week*. Every once in a while, we should sync our forks with the original repositories. To do this, use the following commands.

```bash
git remote add upstream https://github.com/scratchfoundation/scratch-vm.git
git fetch upstream
git rebase upstream/develop
```
At this point, there will likely be merge conflicts. They should only be in [`package-lock.json`](https://github.com/broderio/mbot_scratch_gui/blob/develop/package-lock.json). Resolve these conflicts before continuing. Once the merge conflicts are resolved, finish the rebase.
```bash
git rebase --continue
git config pull.rebase false
git pull
git push
```