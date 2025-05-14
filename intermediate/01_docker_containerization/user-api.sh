#!/usr/bin/env bash

API_URL="http://localhost:3000"
TOKEN_FILE=".api_token"

function prompt_credentials() {
  read -rp "Username: " USERNAME
  read -rp "Email: " EMAIL
  read -srp "Password: " PASSWORD
  echo
}

function register_user() {
  echo ">> Registrando usuário..."
  RESPONSE=$(curl -s -X POST "$API_URL/auth/register" \
    -H "Content-Type: application/json" \
    -d "{\"username\":\"$USERNAME\",\"email\":\"$EMAIL\",\"password\":\"$PASSWORD\"}")
  echo "$RESPONSE" | jq
}

function login_user() {
  echo ">> Fazendo login..."
  RESPONSE=$(curl -s -X POST "$API_URL/auth/login" \
    -H "Content-Type: application/json" \
    -d "{\"email\":\"$EMAIL\",\"password\":\"$PASSWORD\"}")
  echo "$RESPONSE" | jq
  TOKEN=$(echo "$RESPONSE" | jq -r .token)
  if [[ "$TOKEN" && "$TOKEN" != "null" ]]; then
    echo "$TOKEN" > "$TOKEN_FILE"
    echo "Token salvo em $TOKEN_FILE"
  else
    echo "Falha ao obter token."
  fi
}

function list_users() {
  if [[ ! -f "$TOKEN_FILE" ]]; then
    echo "Token não encontrado. Faça login primeiro."
    exit 1
  fi
  TOKEN=$(<"$TOKEN_FILE")
  echo ">> Listando usuários..."
  curl -s -X GET "$API_URL/users" \
    -H "Authorization: Bearer $TOKEN" | jq
}

function show_me() {
  if [[ ! -f "$TOKEN_FILE" ]]; then
    echo "Token não encontrado. Faça login primeiro."
    exit 1
  fi
  TOKEN=$(<"$TOKEN_FILE")
  echo ">> Dados do perfil..."
  curl -s -X GET "$API_URL/users/me" \
    -H "Authorization: Bearer $TOKEN" | jq
}

function usage() {
  cat <<EOF
Uso: $(basename "$0") [opção]

Opções:
  register    Registrar um novo usuário
  login       Autenticar (gera e salva token)
  users       Listar todos os usuários (precisa de token)
  me          Mostrar perfil do usuário logado (precisa de token)
  help        Exibir esta ajuda
EOF
  exit 1
}

# --- Main ---
case "$1" in
  register)
    prompt_credentials
    register_user
    ;;
  login)
    # Usuário já deve ter feito register ou existir na DB
    read -rp "Email: " EMAIL
    read -srp "Password: " PASSWORD
    echo
    login_user
    ;;
  users)
    list_users
    ;;
  me)
    show_me
    ;;
  help|*)
    usage
    ;;
esac

