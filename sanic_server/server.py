from sanic import Sanic
from sanic.response import json
from sanic_cors import CORS
import tensorflow as tf
from tensorflow import keras
import numpy as np
import base64
import os 
class_names = ['Auricularia cornea', 'Pycnoporus sanguineus', 'Chlorophyllum molybdites', 'Leucocoprinus birnbaumii']
app = Sanic("Python-Hosted-Model")
CORS(app)
model = tf.keras.models.load_model(os.path.join("mushroomClassifier500Epoch.h5"))
#request should be base64 or binary format of image 
@app.post("/ai/image")
async def callModel(request):
    image_json = request.json
    #print(image_json)
    #print(image_json.get("image"))
    image_base64 = image_json.get("base64String")
    #print(image_json)
    #print(image_json.get("data"))
    #image_base64 = image_json.get("data")
    #mushroom_path = os.path.join(f"./test_image/{image_json}")
    #print(mushroom_path)
    decoded_image = base64.b64decode((image_base64))
    img_file = open('image.jpeg', 'wb')
    img_file.write(decoded_image)
    img_file.close()
    img = tf.keras.utils.load_img(
    "image.jpeg", target_size=(256, 256)
    )
    img_array = tf.keras.utils.img_to_array(img)
    img_array = tf.expand_dims(img_array, 0) # Create a batch

    predictions = model.predict(img_array)
    score = tf.nn.softmax(predictions[0])
    print(score)
    print(np.argmax(score))
    return json({"message" : 
    "This image most likely belongs to {} with a {:.2f} percent confidence."
    .format(class_names[np.argmax(score)], 100 * np.max(score))
    , "className" : "{}".format(class_names[np.argmax(score)])
    })

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8000)