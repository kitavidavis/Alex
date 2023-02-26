import * as React from 'react';
import { View, PermissionsAndroid, ScrollView, Dimensions } from 'react-native';
import { BottomNavigation, Button, Text, TextInput, useTheme, List, Menu, ActivityIndicator, Portal, MD3Colors, IconButton as PaperIconButton, Divider, Dialog, Surface } from 'react-native-paper';
import Search from './Search';
import { Heading, Radio, Alert, VStack, HStack, Text as NativeText, IconButton, CloseIcon, Container, Center } from "native-base";
import { LOCAL_STORAGE_NAME } from './constants';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Geolocation from 'react-native-geolocation-service';
import { ToastAndroid } from 'react-native';
import { Searchbar } from 'react-native-paper';
import * as turf from "@turf/turf";

const Home = () => {
const theme = useTheme();
  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    { key: 'layers', title: 'Layers', focusedIcon: 'layers', unfocusedIcon: 'layers'},
    { key: 'add', title: 'Add', focusedIcon: 'layers-plus' },
    { key: 'settings', title: 'Settings', focusedIcon: 'cog', unfocusedIcon: 'cog' },
  ]);

  const navigateTo = (idx: number) => {
    setIndex(idx);
  }

  const height = Dimensions.get("window").height;

  const LayersRoute = () => {
    const [layers, setLayers] = React.useState([]);
    const [ready, setReady] = React.useState(false);
    const [query, setQuery] = React.useState<string>("");
    const [opened, setOpened] = React.useState<boolean>(false);
    const [obj, setObj] = React.useState<any>(null);
    const [dialog_visible, setDialogVisible] = React.useState<boolean>(false);
    const [opened_idx, setOpenedIDX] = React.useState<number>(0);

    const clickLayer = (idx: number) => {
      setOpenedIDX(idx);
      setObj(layers[idx]);
      setOpened(true);
    }

    const goBack = () => {
      setOpened(false);
      setObj(null);
    }

    const deleteLayer = async (idx: number) => {
      setDialogVisible(false);
      setReady(false);
      layers.splice(idx, 1); // splice the layer from the layers list.
      await AsyncStorage.setItem(LOCAL_STORAGE_NAME, JSON.stringify(layers));
      setLayers([...layers]);
      setReady(true);
      setOpened(false);

    }

    const getLayers = async () => {
        setReady(false);
        let store = JSON.parse(await AsyncStorage.getItem(LOCAL_STORAGE_NAME));
        if(store){
          setLayers(store);
        }
        setReady(true);
    }

    const hideDialog = () => {
      setDialogVisible(false);
    }

    React.useEffect(() => {
        getLayers()
    }, [])
    return (
        ready ? (
            !opened ? (
              <>
              <Searchbar value={query} onChangeText={(val) => {setQuery(val)}} style={{borderRadius: 28, marginBottom: 20, marginTop: 10}} placeholder="Search layers ..."/>
              {layers.length === 0 ? (
                      <View style={{justifyContent: 'center', alignItems: 'center', flex: 1, flexDirection: 'column'}}>
                          <Text variant="titleMedium">No Data Found</Text>
                          <Button icon="plus" mode="contained" labelStyle={{fontSize: 18}} style={{borderRadius: 28, height: 45, justifyContent: 'center', marginTop: 20,}} onPress={() => {navigateTo(1)}}>New Layer</Button>
                      </View>
              ) : (
                  <View>
  
                      <ScrollView style={{height: height * 0.6}}>
                          { layers.filter((item: any) => {
                            return item?.name?.toLowerCase().includes(query.toLowerCase());
                          }).map((item:any, index:  number) => {
                              return (
                                  <List.Item
                                  key={`layer-${index}`}
                                  onPress={() => {clickLayer(index)}}
                                  title={item.name}
                                  description={item.crs?.properties?.name}
                                  left={props => <List.Icon {...props} icon="layers" />}
                              />
                              )
                          })}
                      </ScrollView>
                  </View>
              )}
      
              </>
            ) : (
              <>
              <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
              <PaperIconButton icon="arrow-left" onPress={() => {goBack()}} />
              <PaperIconButton icon="delete" onPress={() => {setDialogVisible(true)}} />
              </View>
              <View style={{marginLeft: 10, marginRight: 10}}>
              <Container>
            <Heading>
              <NativeText color="emerald.500">{obj?.name}</NativeText>
            </Heading>
            <NativeText mt="3" color="white" fontWeight="medium">
             {obj?.description || "No description was added."}
            </NativeText>
            <Heading size="sm" mt="3">
              <NativeText color="emerald.500">Layer Properties</NativeText>
            </Heading>
            <NativeText color="white" fontWeight="medium">
              {"Layer Type: " + obj?.layer_type || "Unknown"}
            </NativeText>
            <NativeText color="white" fontWeight="medium">
              {"CRS: " + obj?.crs?.properties?.name || "Unknown"}
            </NativeText>
            {obj?.layer_type === "Polygon" ? (
              <>
            <NativeText color="white" fontWeight="medium">
            {"Area: " + obj?.area || "Unknown" + "sq.metres"}
          </NativeText>
          <NativeText color="white" fontWeight="medium">
            {"Center: " + JSON.stringify(obj?.center?.geometry?.coordinates) || "Unknown"}
          </NativeText>
          <NativeText color="white" fontWeight="medium">
            {"Center of Mass: " + JSON.stringify(obj?.center_of_mass?.geometry?.coordinates) || "Unknown"}
          </NativeText>
          </>
            ) : obj?.layer_type === "Polyline" ? (
              <NativeText  color="white" fontWeight="medium">
              {"Polyline Length: " + obj?.length || "Unknown" + "KM"}
            </NativeText>
            ) : null}

            <Heading size="sm" mt="2" mb="2">
              <NativeText color="emerald.500">Other Details</NativeText>
            </Heading>
          </Container>
          <ScrollView style={{height: height * 0.3}}>
                {obj?.features.map((item:any, index:number) => {
                  return (
                    <Surface key={`instance-${index}`} style={{marginBottom: 10, padding: 5}}>
                    <NativeText color="white" fontWeight="medium">{`Accuracy: ${item?.properties?.accuracy}`}</NativeText>
                    <NativeText color="white" fontWeight="medium">{`Speed: ${item?.properties?.speed}`}</NativeText>
                    <NativeText color="white" fontWeight="medium">{`Altitude: ${item?.properties?.altitude}`}</NativeText>
                    <NativeText color="white" fontWeight="medium">{`Timestamp: ${item?.properties?.timestamp}`}</NativeText>
                    <NativeText color="white" fontWeight="medium">{`Instance Coordinates: ${item?.geometry?.coordinates}`}</NativeText>
                    </Surface>
                  )
                })}
          </ScrollView>
          <Portal>
          <Dialog visible={dialog_visible} onDismiss={hideDialog}>
          <Dialog.Content>
              <Text variant="bodyMedium">Are you sure you want to delete the layer. This action cannot be reverted back.</Text>
            </Dialog.Content>
            <Dialog.Actions>
              <Button onPress={hideDialog}>Cancel</Button>
              <Button onPress={() => {deleteLayer(opened_idx)}}>Ok</Button>
            </Dialog.Actions>
          </Dialog>
          </Portal>
        </View>
              </>
            )
        ) : (
            <View style={{flex: 1, flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
                <ActivityIndicator animating />
            </View>
        )
    )
}

const NewLayerRoute = () => {
    const [step, setStep] = React.useState(0);
    const [layer_type, setLayerType] = React.useState<string>("Point");
    const [name, setName] = React.useState<string>("");
    const [description, setDescription] = React.useState<string>("");
    const [loading, setLoading] = React.useState<boolean>(false);
    const [temp, setTemp] = React.useState<
    Array<{
        type: string,
        properties: {description: string},
        geometry: {type: string, coordinates: []}
    }>
>([]); // holds the current coordinate parameters i.e properties & geometry
    const [accuracy, setAccuracy] = React.useState(100);
    /**
     * THE DATA MODEL THAT FORMS A LAYER.
     * In some instances, the user might need to collect more than one point in the same layer.
     * Requires the user to define the name of a particular point/line/polygon
     * obj = { "type": "Feature", "properties": {  "description": [user-defined-description] }, "geometry": { "type": "Point", "coordinates": [latitude, longitude] } }
     */

       const useGPS = (jumpstart: boolean) => {
        Geolocation.getCurrentPosition(
            (position) => {
              setAccuracy(position.coords.accuracy);
              if(!jumpstart){
                addLayer({ "type": "Feature", "properties": { "accuracy": position.coords.accuracy, "speed": position.coords.speed, "altitude": position.coords.altitude, "timestamp": position.timestamp }, "geometry": { "type": layer_type, "coordinates": [position.coords.latitude, position.coords.longitude] } })
              }
            },
            (error) => {
              // See error code charts below.
              console.log(error.code, error.message);
            },
            { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
        );
       }


       const requestGPSPermission = async (jumpstart: boolean) => {
        try {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
            {
              title: 'Geo-App',
              message:'Geo-App wants to access your GPS',
              buttonNeutral: 'Ask Me Later',
              buttonNegative: 'Cancel',
              buttonPositive: 'OK',
            },
          );
          if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            // capture location
            useGPS(jumpstart);
            if(jumpstart){
                Geolocation.watchPosition((position) => {
                    setAccuracy(position.coords.accuracy);
                }, (error) => {
                    // handle watch position error
                }, { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 });
            }
          } else {
            ToastAndroid.show("GPS Permission was denied!", ToastAndroid.SHORT)
          }
        } catch (err) {
            ToastAndroid.show("Something wrong is happening!", ToastAndroid.SHORT)
        }
      };

      React.useEffect(() => {
        requestGPSPermission(true);

      }, []);

    const incrementStep = () => {
        setStep(step + 1);
    };

    const decrementStep = () => {
        setStep(step - 1);
    }

    const addLayer = (obj: any) => {
        setTemp((prevTemp)  => [...prevTemp, obj]);
    }

    const saveLayer = async () => {
        setLoading(true);

        let area = 0;
        let length = 0;
        let center: any = [];
        let center_of_mass: any = [];

        if(layer_type === "Polygon"){
          let arr = [];
          for(let i=0; i<temp.length; i++){
            let coord = temp[i].geometry.coordinates;
            arr.push(coord);
          }

          // close the polygon;
          arr.push(temp[0].geometry.coordinates);

          var polygon = turf.polygon([arr]);
          area = turf.area(polygon);

          center_of_mass = turf.centerOfMass(polygon);

          var feature = turf.points(arr);
          center = turf.center(feature);

        }

        if(layer_type === "Polyline"){
          let arr = [];

          for(let i=0; i<temp.length; i++){
            let coord = temp[i].geometry.coordinates;
            arr.push(coord);
          }

          var line = turf.lineString(arr);

          length = turf.length(line);

        }

        const coords = {
            "type": "FeatureCollection",
            "name": name,
            "description": description,
            "layer_type": layer_type,
            "area": area,
            "center": center,
            "center_of_mass": center_of_mass,
            "length": length,
            "crs": { "type": "name", "properties": { "name": "urn:ogc:def:crs:OGC:1.3:CRS84" } },
              "features": temp
           };
        // stringify and strore into local storage.
        // clear and prepare the canvas again.
        let store = await AsyncStorage.getItem(LOCAL_STORAGE_NAME);
        if(store !== null){
            let storeArr = [...JSON.parse(store)];

            storeArr.push(coords);

            await AsyncStorage.setItem(LOCAL_STORAGE_NAME, JSON.stringify(storeArr));

            setTemp([]);
            setStep(0);
            setName("");
            setDescription("");
            setLayerType("Point");

            setLoading(false);
            setIndex(0);

            ToastAndroid.show("Feature added successfully", ToastAndroid.SHORT)

        } else {
            // the store does not exist. A weird scenario because it is supposed to be created immediatelly the app starts.
            // handle this as an error.
            setLoading(false);
        }


    }

    return (
            step === 0 ? (
                <View style={{justifyContent: 'center', margin: 10, flex: 1, flexDirection: 'column'}}>
            <Heading size="lg" fontWeight="600" color = "warmGray.50">
                New Layer
        </Heading>
        <Heading mt="1" color="warmGray.200" fontWeight="medium" size="xs">
          Start creating a new layer.
        </Heading>
            <TextInput value={name} onChangeText={(text) => {setName(text)}} style={{marginBottom: 10, marginTop: 20}} mode='outlined' label="Name" placeholder='Name of the layer e.g Beacon 101' />
            <TextInput value={description} onChangeText={(text) => {setDescription(text)}} style={{marginBottom: 10}} multiline numberOfLines={4} mode='outlined' label="Description" placeholder='A description about this layer. ' />
            <Heading mt="1" color="warmGray.200" fontWeight="medium" size="md">
                Layer Type
                </Heading>
            <Radio.Group name="Layer Type" accessibilityLabel="Layer Type" value={layer_type} onChange={val => {
                setLayerType(val);
            }}>
                <Radio _text={{color: "warmGray.200" }} value="Point" my={2}>
                    Point
                </Radio>
                <Radio _text={{color: "warmGray.200" }} value="Polyline" my={2}>
                    Polyline
                </Radio>
                <Radio _text={{color: "warmGray.200" }} value="Polygon" my={2}>
                    Polygon
                </Radio>
            </Radio.Group>
            <View style={{alignItems: "flex-end", marginTop: 20}}>
                <Button disabled={name== "" || layer_type === ""} mode='contained' labelStyle={{fontSize: 18}} style={{height: 45, justifyContent: 'center'}} icon="chevron-right" onPress={() => {incrementStep()}}>Continue</Button>
            </View>
            </View>
            ) : (
                <>
                <Alert w="100%" status={accuracy < 30 ? "info" : "warning"}>
            <VStack space={2} flexShrink={1} w="100%">
              <HStack flexShrink={1} space={2} justifyContent="space-between">
                <HStack space={2} flexShrink={1}>
                  <Alert.Icon mt="1" />
                  <NativeText fontSize="md" color="coolGray.800">
                    GPS Accuracy Value:
                  </NativeText>
                </HStack>
                <NativeText fontSize="md" style={{color: accuracy < 30 ? "green" : "red"}}>
                    {parseFloat(accuracy).toFixed(0)}
                  </NativeText>
              </HStack>
            </VStack>
          </Alert>

          <View style={{margin: 20}}>
          <Heading size="lg" fontWeight="600" color = "warmGray.50">
          {layer_type + " Layer"}
        </Heading>
            {layer_type === "Point" ? (
                        <Heading mt="5" color="warmGray.200" fontWeight="medium" size="xs">
                        You need to capture atleast one pair of coordinate to create a point feature.
                      </Heading>
            ) : layer_type === "Polyline" ? (
                <Heading mt="1" color="warmGray.200" fontWeight="medium" size="xs">
                You need to capture atleast two pair of coordinates to create a line feature.
              </Heading>
            ) : (
                <Heading mt="1" color="warmGray.200" fontWeight="medium" size="xs">
                You need to capture atleast three pair of coordinates to create a polygon feature.
              </Heading>
            )}

            <View style={{justifyContent: 'center', marginTop: 30, alignItems: 'center'}}>
                <ScrollView style={{height: height * 0.3}}>
                    {temp.map((item, index) => {
                        return (
                            <Text  key={index + "coords"}>{(index + 1) + ":" + JSON.stringify(item)}</Text>
                        )
                    })}
                </ScrollView>
                <Button style={{marginBottom: 10, marginTop: 20}} icon="crosshairs-gps" mode='contained' onPress={() => {requestGPSPermission(false)}}>Capture Coordinate</Button>
                {layer_type === "Point" ? (
                    temp.length > 0 ? (
                        <Button loading={loading} onPress={() => {saveLayer()}} style={{marginBottom: 10}} mode='contained'>Save Feature</Button>
                    ) : null ) : layer_type === "Polyline" ? (
                        temp.length > 1 ? (
                            <Button loading={loading} onPress={() => {saveLayer()}} style={{marginBottom: 10}} mode='contained'>Save Feature</Button>
                        ) : null
                    ) : (
                        temp.length > 2 ? (
                            <Button loading={loading} onPress={() => {saveLayer()}} style={{marginBottom: 10}} mode='contained'>Save Feature</Button>
                        ) : null
                    )}
            </View>
          </View>
                </>
            )
    )
}

const SettingsRoute = () => {
  const [dialog_visible, setDialogVisible] = React.useState<boolean>(false);

  const hideDialog = () => {
    setDialogVisible(false);
  }

  const deleteAllLayers = async () => {
    await AsyncStorage.removeItem(LOCAL_STORAGE_NAME);
    setIndex(0);
  }
    return (
        <View style={{marginTop: 10, flex: 1, flexDirection: 'column'}}>
        <Text variant="titleMedium">- This prototype app shows the possibility of collecting spatial data in simple means. {"\n"} {"\n"} 
        - It can be used by ordinary citizens with smartphones.{"\n"} {"\n"} - The project was designed based on guidance by various people.{"\n"} {"\n"} - Special regards to<Text style={{color: "teal", fontFamily: 'cursive'}}> Mr.David Kitavi</Text> for the engineering architecture support.</Text>

        <Button onPress={() => {setDialogVisible(true)}} style={{marginTop: 50, backgroundColor: 'red'}} labelStyle={{color: "white"}} mode='contained'>Clear All Dataset</Button>
        <Portal>
          <Dialog visible={dialog_visible} onDismiss={hideDialog}>
          <Dialog.Content>
              <Text variant="bodyMedium">Are you sure you want to delete all the layers. This action cannot be reverted back.</Text>
            </Dialog.Content>
            <Dialog.Actions>
              <Button onPress={hideDialog}>Cancel</Button>
              <Button onPress={() => {deleteAllLayers()}}>Ok</Button>
            </Dialog.Actions>
          </Dialog>
          </Portal>
    </View>
    )
}

  const renderScene = BottomNavigation.SceneMap({
    layers: LayersRoute,
    add: NewLayerRoute,
    settings: SettingsRoute,
  });

  return (
    <BottomNavigation
    barStyle={{backgroundColor: "#191C1C", borderTopWidth: 1, borderTopColor: theme.colors.outline}}
    style={{height: 30}}
      navigationState={{ index, routes }}
      onIndexChange={setIndex}
      renderScene={renderScene}
    />
  );
};

export default Home;