FROM trufflesuite/ganache-cli:latest

COPY ganache_with_account.sh /app/

RUN chmod a+x /app/ganache_with_account.sh

ENTRYPOINT ["sh", "/app/ganache_with_account.sh"]