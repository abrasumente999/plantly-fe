import {
  StyleSheet,
  Text,
  View,
  StatusBar,
  SafeAreaView,
  FlatList,
  Image,
  Pressable,
  Modal,
} from "react-native";
import Nav from "../Nav";
import UserAreaHeader from "./UserAreaHeader";
import UserContext from "../context/userContext";
import { useEffect, useState, useContext } from "react";
import { getUserPlants, deleteUserPlant } from "../../api/api";
import { dateToDays } from "../../utils/utils";
import MyPlantModal from "./MyPlantModal";
import dayjs from "dayjs";
var relativeTime = require("dayjs/plugin/relativeTime");
dayjs.extend(relativeTime);

const UserPlants = ({ navigation }) => {
  const [pressed, setPressed] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [userPlantsData, setUserPlantsData] = useState([]);
  const [singlePlantIndex, setSinglePlantIndex] = useState("1");
  const [singlePlantData, setSinglePlantData] = useState({
    category: "Dracaena",
    climate: "Tropical",
    common_name: "Janet Craig",
    latin_name: "Dracaena deremensis 'Janet Craig'",
    light_preference: "Strong light",
    origin: "Cultivar",
    picture_url: "http://www.tropicopia.com/house-plant/thumbnails/5556.jpg",
    plant_id: 1,
    pruning: "If needed",
    temp_max: 30,
    temp_min: 10,
    watering_advice: "Keep moist between watering & Can dry between watering",
  });
  const { user, setUser } = useContext(UserContext);

  useEffect(() => {
    setSinglePlantData(userPlantsData[singlePlantIndex - 1]);
  }, [singlePlantIndex]);

  useEffect(() => {
    getUserPlants().then((plants) => {
      setUserPlantsData(plants);
    });
  }, []);

  useEffect(() => {
    pressed ? setModalVisible(true) : setModalVisible(false);
  }, [pressed]);

  const toggleIsPressed = (myPlantId) => {
    setSinglePlantIndex(myPlantId);
    setPressed((currValue) => {
      return !currValue;
    });
  };

  const togglePressed = () => {
    setPressed((currValue) => {
      return !currValue;
    });
  };

  const deletePlant = (id) => {
    deleteUserPlant(user, id).then(() => {
      setUserPlantsData((currPlants) => {
        const newPlants = currPlants.filter((plant) => {
          return plant.my_plant_id !== id;
        });
        return newPlants;
      });
    });
  };

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safe}>
        <StatusBar
          animated={true}
          barStyle="light-content"
          showHideTransition="slide"
          backgroundColor={styles.header.backgroundColor}
        />
        <View style={styles.header}>
          <UserAreaHeader header="My Plants" style={styles.header} />
          <Nav navigation={navigation} />
        </View>
      </SafeAreaView>

      <View style={styles.userAreaBody}>
        <View style={styles.filterAndSortByContainer}>
          <Pressable style={styles.button}>
            <Text>Filter</Text>
          </Pressable>
          <Pressable style={styles.button}>
            <Text>Sort by</Text>
          </Pressable>
        </View>

        <FlatList
          numColumns={2}
          data={userPlantsData}
          renderItem={(itemData) => {
            return (
              <Pressable
                style={styles.plantsListItem}
                onPress={() => {
                  toggleIsPressed(itemData.item.my_plant_id);
                }}
                onLongPress={() => {
                  deletePlant(itemData.item.my_plant_id);
                }}
              >
                <View style={styles.plantItemImage}>
                  <Image
                    source={{ uri: itemData.item.picture_url }}
                    style={{ height: 50, width: 50, borderRadius: 100 }}
                  />
                </View>

                <View style={styles.plantItemInfo}>
                  <Text>{itemData.item.nickname}</Text>
                  <Text style={styles.info}>{itemData.item.common_name}</Text>

                  <Text style={styles.info}>
                    {dayjs(itemData.item.last_watered_date).fromNow()}
                  </Text>
                </View>
              </Pressable>
            );
          }}
          keyExtractor={(item, index) => {
            return item.my_plant_id;
          }}
        />
      </View>
      <Modal visible={modalVisible} animationType="slide" transparent={true}>
        <MyPlantModal
          singlePlantData={singlePlantData}
          setPressed={setPressed}
          togglePressed={togglePressed}
        />
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#D9D9D9",
    flex: 5,
  },

  safe: {
    width: "100%",
    flex: 0.5,
    backgroundColor: "#2B8B30",
    color: "#1E2720",
  },

  userAreaBody: {
    flex: 1,
    padding: 5,
  },

  filterAndSortByContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginVertical: 15,
  },

  button: {
    backgroundColor: "#F1F1F2",
    flex: 1,
    alignItems: "center",
    paddingVertical: 6,
    marginHorizontal: 10,
    borderRadius: 20,
  },

  plantsList: { flex: 1 },

  header: { flex: 1.5, color: "#F1F1F2", paddingTop: StatusBar.currentHeight },

  headerText: { color: "#F1F1F2", fontSize: 40 },

  subHeadingText: { color: "#F1F1F2" },

  plantsListItem: {
    backgroundColor: "#F1F1F2",
    borderRadius: 20,
    flexDirection: "row",
    flex: 0.5,
    margin: 5,
    alignItems: "center",
    paddingVertical: 10,
    paddingRight: 5,
  },

  plantItemImage: { alignItems: "center", paddingHorizontal: 10 },

  plantItemInfo: {
    flex: 1,
  },
  info: {
    fontSize: 12,
  },
});

export default UserPlants;
