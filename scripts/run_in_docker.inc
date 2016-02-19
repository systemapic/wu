
# We assume there's no "docker" command inside the docker
which docker && {
  echo "We're probably outside the wu docker"
  test -n "$SYSTEMAPIC_DOMAIN" || {
    echo "Please export SYSTEMAPIC_DOMAIN env variable" >&2
    exit 1
  }
  container=${SYSTEMAPIC_DOMAIN}_wu_1
  echo "Executing myself inside container ${container}"
  if test -t 0; then
    TTYSWITCH=-t
  else
    TTYSWITCH=
  fi
  exec docker exec -i ${TTYSWITCH} ${container} \
    ./scripts/`basename $0` $@
}

