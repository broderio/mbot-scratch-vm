# Check if user has nvm installed
if [ -z "$NVM_DIR" ]; then
  # Install nvm
  echo "Installing nvm..."
  curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.0/install.sh | bash
  
  # Source nvm script to make nvm available in the current shell session
  export NVM_DIR="$HOME/.nvm"
  [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # This loads nvm
  [ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"  # This loads nvm bash_completion

  # Install node
  nvm install 22

  # Check if nvm is installed successfully
  node -v
  nvm -v
fi

# Create a symlink for node and npm
if [ ! -f "/usr/bin/npm" ]; then
  sudo ln -s /home/mbot/.nvm/versions/node/v22.9.0/bin/npm /usr/bin/npm
fi
if [ ! -f "/usr/bin/node" ]; then
  sudo ln -s /home/mbot/.nvm/versions/node/v22.9.0/bin/node /usr/bin/node
fi
if [ ! -f "/usr/bin/npx" ]; then
  sudo ln -s /home/mbot/.nvm/versions/node/v22.9.0/bin/npx /usr/bin/npx
fi

npm install
npm link
