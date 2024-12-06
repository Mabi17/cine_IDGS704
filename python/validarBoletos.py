from flask import Flask, request, jsonify
from flask_cors import CORS
import requests  # Librería para realizar solicitudes HTTP

app = Flask(__name__)
CORS(app)

# URL de la API externa
EXTERNAL_API_URL = "http://162.214.153.239:5011/api/reservas/validar_reservacion"

@app.route('/validar-boleto', methods=['POST'])
def validar_boleto():
    try:
        print("Iniciando procesamiento de solicitud...")
        data = request.get_json()
        print("Datos recibidos:", data)

        if not data:
            print("Error: No se envió JSON.")
            return jsonify({'status': 'error', 'message': 'Formato de entrada no válido. Se esperaba JSON'}), 400
        
        codigo_boleto = data.get('codigo-boleto')
        if not codigo_boleto:
            print("Error: Código del boleto no proporcionado.")
            return jsonify({'status': 'error', 'message': 'Código del boleto no proporcionado'}), 400

        print("Realizando solicitud a la API externa...")
        response = requests.post(EXTERNAL_API_URL, json={"codigo": codigo_boleto})
        
        if response.status_code != 200:
            print("Error al conectarse a la API externa:", response.status_code)
            return jsonify({'status': 'error', 'message': 'Error al conectarse a la API externa'}), 500
        
        boletos = response.json()
        print("Datos obtenidos de la API externa:", boletos)

        # Buscar el boleto en los datos de la API
        boleto = boletos;

        if boleto:
            # Verifica el estado del boleto
            estado = boleto.get('estado', 'disponible')  # Asume 'disponible' si no se especifica el estado
            if estado == 'ocupado':
                print("Boleto ya usado.")
                return jsonify({'status': 'error', 'message': 'Boleto ya usado'}), 403

            # Retorna los detalles del boleto
            return jsonify({
                'status': 'success',
                'message': 'Boleto válido',
                'data': boleto
            }), 200
        else:
            print("Boleto no encontrado.")
            return jsonify({'status': 'error', 'message': 'Boleto no encontrado'}), 404

    except Exception as e:
        print("Error inesperado:", e)
        return jsonify({'status': 'error', 'message': f'Error inesperado: {e}'}), 500

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
