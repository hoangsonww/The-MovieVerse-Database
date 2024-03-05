# The MovieVerse - `MovieVerse-Scripts` Directory

This directory contains a set of shell scripts used for setting up and managing the MovieVerse application environment, Docker containerization, and deployment.

## Scripts Overview

- `deploy.sh`: This script is used to deploy the MovieVerse application to a server. It automates the deployment process, ensuring all components are correctly configured and started.

- `genEnv.sh`: This script generates the necessary environment variables required by the MovieVerse application. It ensures that all the required variables are set for the application to run properly.

- `setup.sh`: This script sets up the necessary prerequisites for the MovieVerse application to run. This may include software installations, directory setup, and permission settings.

- `setupMicroservices.sh`: In case the MovieVerse application is designed to run as microservices, this script handles the setup and configuration of all the individual microservices.

- `test.sh`: This script runs a series of tests to ensure that the MovieVerse application is functioning correctly. It can be used to perform routine checks or after setup and deployment.

- `Makefile`: This file contains a set of commands that can be used to automate the deployment and management of the MovieVerse application. It is used in conjunction with the shell scripts to provide a more streamlined deployment process.

- `entrypoint.sh`: This script is used as the entry point for the MovieVerse application. It is used to start the application and handle any necessary configurations.

- `test_dockerimage.sh`: This script is used to test the Docker image of the MovieVerse application. It runs a series of tests to ensure that the image is functioning correctly.

- `create_release.py`: This script is used to create a new release of the MovieVerse application. It automates the process of creating a new release, including versioning, tagging, and packaging.

- `update_linux_arm64.sh`: This script is used to update the MovieVerse application on a Linux ARM64 platform. It automates the process of updating the application, including downloading the latest release and restarting the application.

- `update_node.py`: This script is used to update the Node.js version used by the MovieVerse application. It automates the process of updating Node.js, including downloading the latest version and updating the application configuration.

- `update_python.py`: This script is used to update the Python version used by the MovieVerse application. It automates the process of updating Python, including downloading the latest version and updating the application configuration.

## Usage

To run any of these scripts, you need to have the necessary permissions. You can assign execution permissions using the following command:

```bash
chmod +x script-name.sh
```

Replace `script-name.sh` with the name of the script you want to execute.

After setting the execution permissions, you can run a script with the following command:

```bash
./script-name.sh
```

Ensure you are in the correct directory where the scripts are located, or provide the full path to the script.

## Contributions

If you would like to contribute to the development or improvement of these scripts, please follow the contribution guidelines outlined in the project's main documentation.

## License

These scripts are part of the MovieVerse application and are subject to the project's overall license terms.

## Contact

For any further questions or requests, please reach out to the project maintainers at [info@movie-verse.com](mailto:info@movie-verse.com).

---
