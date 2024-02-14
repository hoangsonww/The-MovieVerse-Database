# Shell Scripts Directory

This directory contains a set of shell scripts used for setting up and managing the StickyNotes application environment and deployment.

## Scripts Overview

- `deploy.sh`: This script is used to deploy the StickyNotes application to a server. It automates the deployment process, ensuring all components are correctly configured and started.

- `genEnv.sh`: This script generates the necessary environment variables required by the StickyNotes application. It ensures that all the required variables are set for the application to run properly.

- `setup.sh`: This script sets up the necessary prerequisites for the StickyNotes application to run. This may include software installations, directory setup, and permission settings.

- `setupMicroservices.sh`: In case the StickyNotes application is designed to run as microservices, this script handles the setup and configuration of all the individual microservices.

- `test.sh`: This script runs a series of tests to ensure that the StickyNotes application is functioning correctly. It can be used to perform routine checks or after setup and deployment.

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

These scripts are part of the StickyNotes application and are subject to the project's overall license terms. Refer to thr `LICENSE` file in the root directory.

## Contact

For any further questions or requests, please reach out to the project maintainers at [info@movie-verse.com](mailto:info@movie-verse.com).

---
