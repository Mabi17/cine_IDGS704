from flask import Flask, request, jsonify
from flask_cors import CORS
import mysql.connector
from mysql.connector import Error
from datetime import timedelta

app = Flask(__name__)
CORS(app)

db_config = {
    'host': 'localhost', 
    'database': 'CineBoletos',
    'user': 'root',       
    'password': 'Sonic2004'
}

def serialize_boleto(boleto):
    """
    Convierte los datos del boleto a un formato JSON serializable.
    """
    for key, value in boleto.items():
        if isinstance(value, timedelta):
            boleto[key] = str(value)  # Convierte timedelta a string
    return boleto

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

        print("Conectando a la base de datos...")
        connection = mysql.connector.connect(**db_config)
        cursor = connection.cursor(dictionary=True)

        # Consulta para validar el boleto y verificar su estado
        query = """
        SELECT b.codigoBoleto, b.estado, f.idFuncion, f.fechaProyeccion, f.horarioInicio, 
               p.titulo AS pelicula, s.numeroSala AS sala
        FROM boleto b
        INNER JOIN funcion f ON b.idFuncion = f.idFuncion
        INNER JOIN pelicula p ON f.idPelicula = p.idPelicula
        INNER JOIN sala s ON f.idSala = s.idSala
        WHERE b.codigoBoleto = %s
        """
        print("Ejecutando consulta SQL...")
        cursor.execute(query, (codigo_boleto,))
        boleto = cursor.fetchone()

        print("Resultado de la consulta:", boleto)
        if boleto:
            # Verifica el estado del boleto
            estado = boleto['estado']
            if estado == 'ocupado':
                print("Boleto usado.")
                return jsonify({'status': 'error', 'message': 'Boleto ya usado'}), 403

            # Si el boleto está disponible, se marca como usado
            update_query = "UPDATE boleto SET estado = 'usado' WHERE codigoBoleto = %s"
            cursor.execute(update_query, (codigo_boleto,))
            connection.commit()

            boleto_serializable = serialize_boleto(boleto)
            return jsonify({
                'status': 'success',
                'message': 'Boleto válido',
                'data': boleto_serializable
            }), 200
        else:
            print("Boleto no encontrado.")
            return jsonify({'status': 'error', 'message': 'Boleto no encontrado'}), 404

    except mysql.connector.Error as e:
        print("Error en la base de datos:", e)
        return jsonify({'status': 'error', 'message': f'Error en la base de datos: {e}'}), 500
    except Exception as e:
        print("Error inesperado:", e)
        return jsonify({'status': 'error', 'message': f'Error inesperado: {e}'}), 500
    finally:
        if 'cursor' in locals() and cursor:
            cursor.close()
        if 'connection' in locals() and connection.is_connected():
            connection.close()

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
