import os
import pandas as pd
import matplotlib.pyplot as plt
import sys
import json
import io

# Obtén los datos JSON de comanda_productes desde los argumentos de la línea de comandos
comanda_productes = json.loads(sys.argv[1])

if not os.path.exists("imatges_stats"):
    os.makedirs("imatges_stats")

df = pd.DataFrame(comanda_productes, columns=["comanda_id", "producte_id", "categoria"])

# Genera un gráfico de barras de las categorías más pedidas
x_values = df['categoria'].value_counts().index
y_values = df['categoria'].value_counts().values
plt.figure(figsize=(12, 5))  # Ajusta el tamaño de la figura
plt.subplot(121)  # Primer gráfico
plt.show(121)
plt.bar(x_values, y_values)

# Genera un gráfico de barras de las horas a las que se realizan más comandas
hour_values = df['hora_comanda'].value_counts().index
hour_counts = df['hora_comanda'].value_counts().values
plt.subplot(122)  # Segundo gráfico
plt.show(122)
plt.bar(hour_values, hour_counts)

# Guarda las imágenes en archivos separados
nom_imatge_categorias = "comandes_per_producte.png"
image_path_categorias = os.path.join("imatges_stats", nom_imatge_categorias)
plt.savefig(image_path_categorias)

nom_imatge_horas = "comandes_por_horas.png"
image_path_horas = os.path.join("imatges_stats", nom_imatge_horas)
plt.savefig(image_path_horas)

# Lee el contenido de las imágenes y envíalo a la salida estándar
with open(image_path_categorias, 'rb') as image_file_categorias:
    image_content_categorias = image_file_categorias.read()
    with open(image_path_horas, 'rb') as image_file_horas:
        image_content_horas = image_file_horas.read()
        combined_image_content = image_content_categorias + b'\n' + image_content_horas
        sys.stdout.buffer.write(combined_image_content)
