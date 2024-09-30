#!/usr/bin/env bash
#   Use this script to test if a given TCP host/port are available
#   Source: https://github.com/vishnubob/wait-for-it

WAITFORIT_cmdname=$(basename $0)

echoerr() {
    if [[ $WAITFORIT_QUIET -ne 1 ]]; then echo "$@" 1>&2; fi
}

usage() {
    cat << USAGE >&2
Usage:
    $WAITFORIT_cmdname host:port [-s] [-t timeout] [-- command args]
    -h HOST | --host=HOST       Host or IP under test
    -p PORT | --port=PORT       TCP port under test
                                Alternatively, you specify the host and port as host:port
    -s | --strict               Only execute subcommand if the test succeeds
    -q | --quiet                Don't output any status messages
    -t TIMEOUT | --timeout=TIMEOUT
                                Timeout in seconds, zero for no timeout
    -- COMMAND ARGS             Execute command with args after the test finishes
USAGE
    exit 1
}

wait_for() {
    if [[ $WAITFORIT_TIMEOUT -gt 0 ]]; then
        echoerr "$WAITFORIT_cmdname: waiting $WAITFORIT_TIMEOUT seconds for $WAITFORIT_HOST:$WAITFORIT_PORT"
    else
        echoerr "$WAITFORIT_cmdname: waiting for $WAITFORIT_HOST:$WAITFORIT_PORT without a timeout"
    fi
    start_ts=$(date +%s)
    while :
    do
        if [[ $WAITFORIT_ISBUSY -eq 1 ]]; then
            nc -zv $WAITFORIT_HOST $WAITFORIT_PORT
            result=$?
        else
            (echo > /dev/tcp/$WAITFORIT_HOST/$WAITFORIT_PORT) >/dev/null 2>&1
            result=$?
        fi
        if [[ $result -eq 0 ]]; then
            end_ts=$(date +%s)
            echoerr "$WAITFORIT_cmdname: $WAITFORIT_HOST:$WAITFORIT_PORT is available after $((end_ts - start_ts)) seconds"
            break
        fi
        if [[ $WAITFORIT_TIMEOUT -ne 0 ]]; then
            now_ts=$(date +%s)
            elapsed=$((now_ts - start_ts))
            if [[ $elapsed -ge $WAITFORIT_TIMEOUT ]]; then
                echoerr "$WAITFORIT_cmdname: timeout occurred after $WAITFORIT_TIMEOUT seconds waiting for $WAITFORIT_HOST:$WAITFORIT_PORT"
                exit 1
            fi
        fi
        sleep 1
    done
}

# process arguments
while [[ $# -gt 0 ]]
do
    case "$1" in
        *:* )
        hostport=(${1//:/ })
        WAITFORIT_HOST=${hostport[0]}
        WAITFORIT_PORT=${hostport[1]}
        shift 1
        ;;
        -h)
        WAITFORIT_HOST="$2"
        if [[ "$WAITFORIT_HOST" == "" ]]; then break; fi
        shift 2
        ;;
        --host=*)
        WAITFORIT_HOST="${1#*=}"
        shift 1
        ;;
        -p)
        WAITFORIT_PORT="$2"
        if [[ "$WAITFORIT_PORT" == "" ]]; then break; fi
        shift 2
        ;;
        --port=*)
        WAITFORIT_PORT="${1#*=}"
        shift 1
        ;;
        -s | --strict)
        WAITFORIT_STRICT=1
        shift 1
        ;;
        -q | --quiet)
        WAITFORIT_QUIET=1
        shift 1
        ;;
        -t)
        WAITFORIT_TIMEOUT="$2"
        if [[ "$WAITFORIT_TIMEOUT" == "" ]]; then break; fi
        shift 2
        ;;
        --timeout=*)
        WAITFORIT_TIMEOUT="${1#*=}"
        shift 1
        ;;
        --)
        shift
        WAITFORIT_CLI=("$@")
        break
        ;;
        --help)
        usage
        ;;
        *)
        echoerr "Unknown argument: $1"
        usage
        ;;
    esac
done

if [[ "$WAITFORIT_HOST" == "" || "$WAITFORIT_PORT" == "" ]]; then
    echoerr "Error: you need to provide a host and port to test."
    usage
fi

if ! command -v nc >/dev/null 2>&1; then
    WAITFORIT_ISBUSY=0
else
    WAITFORIT_ISBUSY=1
fi

WAITFORIT_TIMEOUT=${WAITFORIT_TIMEOUT:-15}
WAITFORIT_STRICT=${WAITFORIT_STRICT:-0}
WAITFORIT_QUIET=${WAITFORIT_QUIET:-0}

wait_for

if [[ $# -lt 1 ]]; then
    exit 0
fi

if [[ $WAITFORIT_STRICT -eq 1 ]]; then
    exec "$@"
else
    echoerr "$WAITFORIT_cmdname: executing command after waiting"
    exec "$@"
fi
