import argparse
import os
import os.path
import pathlib


DOCKER_COMPOSE_CMD = os.getenv('DOCKER_COMPOSE_CMD', 'docker compose')


def build(target_env, prune, local_run):
    # Prep the foundry env file if necessary
    if not os.path.isfile('packages/foundry/.env'):
        res = os.system('cp packages/foundry/.env.example packages/foundry/.env')
        if res:
            exit(res)

    if prune:
        res = os.system('docker system prune -f')
        if res:
            exit(res)

    if target_env == 'local':
        # Bring down any active container references, just in case to make sure we start fresh
        os.system(f'COMPOSE_COMPATIBILITY=true {DOCKER_COMPOSE_CMD} down')

        cmd = f'COMPOSE_COMPATIBILITY=true {DOCKER_COMPOSE_CMD} build'
        if local_run:
            cmd = f'COMPOSE_COMPATIBILITY=true {DOCKER_COMPOSE_CMD} up --build'
        os.system(cmd)
    else:
        print(f"Builds for {target_env} are not currently supported.")
        return


def deploy(target_env):
    if target_env == 'local':
        os.system('docker exec -ti coms6998_yarn-chain_1 forge clean')
        os.system('docker exec -ti coms6998_yarn-chain_1 yarn deploy')
    else:
        print(f"Deployments for {target_env} are not currently supported.")
        return


def _set_cwd():
    """
    Helper to make sure the current working directory is the top of the repo
    """
    cwd = pathlib.Path.cwd()
    if cwd.parts[-1] == 'bin':
        os.chdir(cwd.parent)


if __name__ == '__main__':
    """
    Example usage:

    python bin/spotlight-cli.py -h
    python bin/spotlight-cli.py local build
    python bin/spotlight-cli.py local build --prune
    python bin/spotlight-cli.py local deploy
    """
    parser = argparse.ArgumentParser(description="Spotlight CLI")
    parser.add_argument(
        'env',
        default='local',
        choices=('local', 'dev', 'prd'),
        help="Target environment to execute subcommands against"
    )

    subparsers = parser.add_subparsers(title='Commands', dest='command')

    build_parser = subparsers.add_parser('build', help="Build the app for the target environment.")
    build_parser.add_argument('--prune', default=False, action='store_true', help="Prune system images.")
    build_parser.add_argument('--run', default=False, action='store_true', dest='local_run', help="Run local instance after building.")

    deploy_parser = subparsers.add_parser('deploy', help='Deploy the app to the target environment')

    test_parser = subparsers.add_parser('test', help='Run tests')

    _set_cwd()

    args = parser.parse_args()
    if args.command == 'build':
        build(args.env, args.prune, args.local_run)
    elif args.command == 'deploy':
        deploy(args.env)
    elif args.command == 'test':
        os.system('docker exec -ti coms6998_yarn-chain_1 yarn test')

    exit(0)
