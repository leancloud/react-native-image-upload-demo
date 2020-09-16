import React, {useState, useEffect} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  Button,
  TouchableOpacity,
  Image,
} from 'react-native';
import ImagePicker from 'react-native-image-picker';
import * as LC from 'leancloud-storage';
import * as adapters from '@leancloud/platform-adapters-react-native';

try {
  LC.setAdapters(adapters);
} catch (err) {}

const app = new LC.App({
  appId: 'xXtdh8MmJx00J6T42Gx5w1iY-gzGzoHsz',
  appKey: 'FMN33lxfN0hjNyY4RDq7dCVg',
  serverURL: 'https://xxtdh8mm.lc-cn-n1-shared.com',
});
const db = new LC.Storage(app);
const File = db.class('_File');

export default function App() {
  const [images, setImages] = useState([]);

  useEffect(() => {
    File.orderBy('createdAt', 'desc')
      .limit(25)
      .find()
      .then(setImages);
  }, []);

  function uploadImage() {
    ImagePicker.showImagePicker({}, image => {
      if (image.didCancel) {
        return;
      }
      const name = image.fileName || 'react-native-demo-image.jpg';
      const data = {blob: image};
      const metaData = {size: image.fileSize};
      File.upload(name, data, {metaData}).then(file =>
        setImages([file, ...images]),
      );
    });
  }

  return (
    <SafeAreaView style={{flex: 1}}>
      <View style={styles.container}>
        <Text style={styles.welcome}>LeanCloud Image Upload Demo</Text>
        <Button title="Upload" onPress={uploadImage} />
        <ScrollView style={styles.gallary}>
          <View style={styles.imageGrid}>
            {images.map(image => (
              <TouchableOpacity key={image.id}>
                <Image style={styles.image} source={{uri: image.url}} />
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 10,
  },
  welcome: {
    fontSize: 28,
    textAlign: 'center',
    marginBottom: 10,
  },
  gallary: {
    flex: 1,
    marginTop: 10,
  },
  imageGrid: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  image: {
    width: 110,
    height: 110,
    margin: 4,
  },
});
