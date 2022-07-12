import React, { Component } from 'react';
import { connect } from "react-redux";
import {
    SafeAreaView,
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    ScrollView,
    Image,
    FlatList,
} from 'react-native';
import DocumentPicker from 'react-native-document-picker';
import RNFS from 'react-native-fs';
import { SearchBar, Button } from 'react-native-elements';
import XLSX from 'xlsx';
import moment from "moment";
import { changeData } from './redux/actions';
import { bindActionCreators } from 'redux';

class Home extends Component {


    constructor(props) {
        super();
        this.state = {
          singleFile: "",
          searchText: "",
          filteredData :[],
          data :[],
          fileName :""
        }   
      }


     readFile = async (filename) => {
        const response = await RNFS.readFile(filename);
        // console.log("response", JSON.stringify(response))
        const workbook = XLSX.read(response, { type: 'binary' });
        const wsName = workbook.SheetNames[0];
        const ws = workbook.Sheets[wsName];
        const dataTemp = XLSX.utils.sheet_to_json(ws, { header: 1 })
        var temp = [];
        for (let i = 1; i < dataTemp.length; ++i) {
            temp.push({
                id: dataTemp[i][0],
                SKU: dataTemp[i][1],
                Date: moment(dataTemp[i][2]).format("MM/DD/YYYY"),
                ProductName: dataTemp[i][3],
                Price: dataTemp[i][4]
            });
        }
       // console.log("imported dta ------"+JSON.stringify(temp))
        this.props.actions.changeData(temp)
       
    };
     searchFilterFunction = (text) => {
        if (text) {
            const newData = this.props.data.filter(function (item) {
                const itemData = item.Price
                    ? item.Price.toString()
                    : ''.toString();
                const textData = text.toString();
                return itemData.indexOf(textData) > -1;
            });
            this.setState({filteredData :newData ,searchText:text});
        } else {
            this.setState({filteredData :this.props.data ,searchText:text});
        }
    };
  
     selectOneFile = async () => {
        try {
            const res = await DocumentPicker.pick({
                type: [DocumentPicker.types.allFiles],
            });
            console.log('res : ', res);
            const uri = res[0];
            const filename = uri.uri.replace("file://", "")
            this.setState({fileName:uri.name , singleFile :uri});
            this.readFile(filename);
        } catch (err) {
            if (DocumentPicker.isCancel(err)) {
            } else {
                throw err;
            }
        }
    };



     renderItem = ({ item }) => (
        <View style={styles.item}>
            <Text style={styles.title}>SKU : {item.SKU}</Text>
            <Text style={styles.title}>Product Name :{item.ProductName}</Text>
            <Text style={styles.title}>Price {item.Price}</Text>
            <Text style={styles.title}>Date :{item.Date}</Text>
            <Button
                onPress={() => this.props.navigation.navigate('Edit',{"item":item})}
                title="Edit Button"
                color="#841584"
                buttonStyle={styles.button}
            />
        </View>
    );
render (){
    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View style={styles.container}>
                <TouchableOpacity
                    activeOpacity={0.5}
                    style={styles.buttonStyle}
                    onPress={this.selectOneFile}>
                    <Text style={{ marginRight: 10, fontSize: 19 }}>
                        Click here to pick csv file
                    </Text>
                    <Image
                        source={{
                            uri: 'https://img.icons8.com/offices/40/000000/attach.png',
                        }}
                        style={styles.imageIconStyle}
                    />
                </TouchableOpacity>
                <Text style={styles.titleText1}>
                    File Name : {this.state.fileName}
                </Text>
            </View>
            <View style={styles.container1}>
                <SearchBar
                    round
                    lightTheme={true}
                    searchIcon={{ size: 24 }}
                    onChangeText={(text) => this.searchFilterFunction(text)}
                    onClear={(text) => this.searchFilterFunction('')}
                    placeholder="Search..."
                    value={this.state.searchText}
                />
                <FlatList
                    data={this.state.filteredData && this.state.filteredData.length > 0 ? this.state.filteredData : this.props.data}
                    id={()=>this.checkId(this.state.id)}
                                        renderItem={this.renderItem}
                    ItemSeparatorComponent={() => <View style={styles.separator} />}
                />

            </View>
        </SafeAreaView>
    );
}
};


const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },
    container1: {
        flex: 10,
        padding: 16,
    },
    titleText: {
        fontSize: 22,
        fontWeight: 'bold',
        textAlign: 'center',
        paddingVertical: 20,
    },
    titleText1: {
        fontSize: 22,
        fontWeight: 'bold',
        textAlign: 'left',
        paddingVertical: 20,
    },
    textStyle: {
        backgroundColor: '#fff',
        fontSize: 15,
        marginTop: 16,
        color: 'black',
    },
    buttonStyle: {
        alignItems: 'center',
        flexDirection: 'row',
        backgroundColor: '#DDDDDD',
        padding: 5,
    },
    imageIconStyle: {
        height: 20,
        width: 20,
        resizeMode: 'stretch',
    },
    item: {
        backgroundColor: '#D3D3D3',
        padding: 20,
        marginVertical: 8,
        marginHorizontal: 16,
    },
    title: {
        fontSize: 32,
    },
    button: {
        marginTop: 20,
        backgroundColor: 'grey',
        borderRadius: 15
    }
});

const ActionCreators = Object.assign(
    {},
    {changeData},
  );
  const mapDispatchToProps = dispatch => ({
    actions: bindActionCreators(ActionCreators, dispatch),
  });


  const mapStateToProps = state => ({
    data: state.data.data,
  });
  
  export default connect(mapStateToProps, mapDispatchToProps)(Home);
