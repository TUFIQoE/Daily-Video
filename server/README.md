# LongTerm Server

## Description
The Django Server Implementation project is designed to deploy the LongTerm server on any physical or virtual server with Linux. This project is not automated with Kubernetes and relies on the manual configuration of the server.

## Features
- Deployment on any Linux based physical or virtual servers
- Relies on Rocky 8 Linux configuration
- Full outline for server preparation including user creation, ssh key setup, ssh configuration, firewall settings, and package installations
- Detailed steps for module configuration
- Guided application and environment configuration including virtual environments, PostgreSQL Servers, and Supervisors. 

## Requirements
- A physical or virtual server with Linux(Rocky 8 preferred)
- CPU: 2 cores
- RAM: 8GB+
- HDD: 20GB for system, 128GB+ for data 
- NET: public IP, domain
- Python 3.9

## Instructions
The [README_deployment.md](../doc/README_deployment) contains detailed instructions for deploying the server. The initial server preparation involves installing Rocky 8 Linux along with other necessary packages. Furthermore, you will be guided through creating system users and configuring ssh keys for these users.

The next step involves configuring various modules such as a virtual environment, PostgreSQL Server, Nginx, and Supervisors. After module configuration, the main LongTerm application needs to be set up. This involves cloning the application from the git repository, installing necessary dependencies, and setting up Super User access.

Finally, the server will run behind an nginx instance which serves as a reverse proxy for the application.

## API
A REST API is available to interact with the Django server. Endpoints are provided for creating and retrieving feedback comments, event-related data, and form data. Swagger documentation is available for further reference.

Please note that the configuration and deployment of the server need to be handled manually. The instructions have been made as clear as possible, but a certain understanding of server management and the Linux environment is expected.

## License
This project is licensed under the MIT License - see the [LICENSE](../LICENSE) file for details.

## Authors & Acknowledgements
This work was done within the TUFIQoE experiment at the AGH University of Science and Technology. Contact person: **Jaroslaw Bulat** e-mail: kwant@agh.edu.pl, kwanty@gmail.com.

  