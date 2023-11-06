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
plt.bar(x_values, y_values)

# Guarda la imagen en un archivo
nom_imatge = "comandes_per_producte.png"
image_path = os.path.join("imatges_stats", nom_imatge)
plt.savefig(image_path)

# Lee el contenido de la imagen y envíalo a la salida estándar
with open(image_path, 'rb') as image_file:
    image_content = image_file.read()
    sys.stdout.buffer.write(image_content)


#print(pd.DataFrame.to_json(df))