import React, { Component, useState } from 'react';
import { View, StyleSheet, Text, Modal } from 'react-native';
import { Agenda } from 'react-native-calendars';
import { TextInput } from 'react-native-paper';
import Button from 'apsl-react-native-button';
import DateTimePicker from '@react-native-community/datetimepicker';
import AsyncStorage from '@react-native-async-storage/async-storage'; 

class Login extends Component {

  render() {
    const { logar, onChangeLogin, login } = this.props;
    return (
      <View style={styles.loginContainer}>
        <Text style={{ fontSize: 25, fontWeight: 'bold', marginBottom: 40 }}>Faça Seu Login</Text>
        <TextInput style={styles.logininput}
          placeholder="Digite seu nome de usuário"
          value={login.username}
          onChangeText={(text) => onChangeLogin( 'username', text )}
        />
        <TextInput style={styles.logininput}
          placeholder="Digite sua senha"
          secureTextEntry={true}
          value={login.password}
          onChangeText={(text) => onChangeLogin( 'password', text )}
        />
        <Button style={styles.loginbutton} onPress={logar}><Text style={styles.btntxt}>Enviar</Text></Button>
      </View>
    );
  }
}

class Calendar extends Component {
  constructor(props) {
    super(props);

    const currentDate = new Date(); // Obtém a data atual
    const year = currentDate.getFullYear(); // Obtém o ano
    const month = (currentDate.getMonth() + 1).toString().padStart(2, '0'); // Obtém o mês (0-11, adicionamos 1)
    const day = currentDate.getDate().toString().padStart(2, '0'); // Obtém o dia
    const hour = currentDate.getHours().toString().padStart(2, '0') + ':' + currentDate.getMinutes().toString().padStart(2, '0')

    // Formata a data como "xxxx-xx-xx"
    const formattedDate = `${year}-${month}-${day}`;

    this.state = {
      selectedDate: formattedDate,
    
      items:{
        '2023-09-18': [{id:1, name: 'Reunião de trabalho', text: '11:00', textf: '16:00' }],
        '2023-09-19': [{id:2, name: 'Ligar para o cliente', text: '13:00', textf: '15:00' }, {id:3, name: 'Ligar para o cliente', text: '16:00', textf: '17:00' }],
        '2023-09-21': [{id:1, name: 'Aniversário do Matheus', text: '20:00', textf: '23:30' }],
      },
      isModalVisible: false,
      newTask: {
        name: '',
        text: hour,
        textf: hour
      },
      login: {
        username: 'Admin',
        password: 'admin',
      },
      isLoginVisible: true,
    };
  }

  handleLogin = () => {
    // Verifique as credenciais aqui, por exemplo:
    const { username, password } = this.state.login;
    if (username === 'Admin' && password === 'admin') {
      this.setState({isLoginVisible: false});
      // alert('Login realizado com sucesso!');
    } else {
      alert('Credenciais inválidas');
    }
  };

  handleDelete = (itemId) => {
      const itemsNew = this.state.items;
      for(let i in this.state.items){
        for(let j in this.state.items[i]){
          if(this.state.items[i][j].id == itemId){
            alert(itemsNew[i][j].name + ' foi deletado com sucesso!');
            itemsNew[i].splice(j, 1);
            this.setState({items: itemsNew });
          }
        }
      }
  }

  handleAdd = (named) => {
    const currentDate = new Date(); // Obtém a data atual
    const hour = currentDate.getHours().toString().padStart(2, '0') + ':' + currentDate.getMinutes().toString().padStart(2, '0')
    const { newTask } = this.state;
    const dateKey = this.state.selectedDate; // Defina a chave de data apropriada aqui.
    const newItem = { id: Date.now(), ...newTask };
    
    if (!this.state.items[dateKey]) {
      this.state.items[dateKey] = [];
    }

    this.state.items[dateKey].push(newItem);
    this.setState({
      isModalVisible: false,
      newTask: { name: '', text: hour, textf: hour},
    });
    
  };

  handleDayPress = (day) => {
    this.setState({selectedDate: day.dateString}, ()=> {
      // alert(this.state.selectedDate);
    })
  }

  render() {
    return (
    
      <>
        <View style={{ flex: 1 , paddingTop: 30}}>
          {this.state.isLoginVisible ? 
            <Login 
              logar={this.handleLogin} 
              login={this.state.login}
              onChangeLogin={(fieldName, value) => this.setState({ login: { ...this.state.login, [fieldName]: value } })}
            /> 
          : 
            <>
              <Agenda
                onDayPress={this.handleDayPress}
                items={this.state.items}
                showOnlySelectedDayItems={true}
                renderEmptyData={() => { return (<><View><Text style={{ fontSize: 20, fontWeight: 'bold', marginTop: 60, textAlign: 'center'}}>Nenhuma tarefa marcada</Text></View></> ); }}
                selected={this.state.selectedDate}
                renderItem={(item) => (
                  <View style={styles.item}>
                    <View>
                      <Text style={styles.time}>{item.text} - {item.textf}</Text>
                      <Text>{item.name}</Text>
                    </View>
                    <Button style={styles.btn} onPress={() => this.handleDelete(item.id)}><Text style={styles.btntxt}>X</Text></Button>
                  </View>
                )}
              />
              <View style={{backgroundColor:"#f0f0f0"}}>
                <Button style={styles.add} onPress={() => this.setState({ isModalVisible: true })}><Text style={styles.btntxt}>Adicionar Tarefa</Text></Button>
                <Button style={styles.add} onPress={() => this.setState({ isLoginVisible: true })}><Text style={styles.btntxt}>Sair</Text></Button>
              </View>

              <AddTaskModal
                isVisible={this.state.isModalVisible}
                newTask={this.state.newTask}
                onClose={() => this.setState({ isModalVisible: false })}
                onSave={this.handleAdd}
                onChange={(fieldName, value) => this.setState({ newTask: { ...this.state.newTask, [fieldName]: value } })}
                textData={(fieldName, value) => this.setState({ newTask: {...this.state.newTask, [fieldName]: value }})}
                textDataf={(fieldName, value) => this.setState({ newTask: {...this.state.newTask, [fieldName]: value }})}
              />
            </>
          }

        </View>
      </>
    );
  }
}

class AddTaskModal extends Component {
  constructor(props) {
    super(props);

    this.state = {
      date: new Date(),
      mode: 'time',
      show: true,
      datef: new Date(),
      modef: 'time',
      showf: true,
    };
  }

  onChangeDate = (event, selectedDate) => {
    const currentDate = selectedDate || this.state.date;
    this.setState({show: Platform.OS === 'ios'});
    this.setState({date: currentDate});

    let tempDate = new Date(currentDate);
    let fDate = tempDate.getDate() + '-' + (tempDate.getMonth() + 1) + '-' + tempDate.getFullYear();
    let fTime = tempDate.getHours().toString().padStart(2, '0') + ':' + tempDate.getMinutes().toString().padStart(2, '0') 

    this.props.textData("text", fTime);
  }

  onChangeDatef = (event, selectedDatef) => {
    const currentDatef = selectedDatef || this.state.datef;
    this.setState({showf: Platform.OS === 'ios'});
    this.setState({datef: currentDatef});

    let tempDatef = new Date(currentDatef);
    let fDatef = tempDatef.getDate() + '-' + (tempDatef.getMonth() + 1) + '-' + tempDatef.getFullYear();
    let fTimef = tempDatef.getHours().toString().padStart(2, '0') + ':' + tempDatef.getMinutes().toString().padStart(2, '0') 

    this.props.textDataf("textf", fTimef);
  }


  showMode = (currentMode) => {
    this.setState({show: true});
    this.setState({mode: currentMode});
  }

  showModef = (currentModef) => {
    this.setState({showf: true});
    this.setState({modef: currentModef});
  }
  
  render() {
    const { isVisible, newTask, onClose, onSave, onChange} = this.props;


    return (
      <Modal visible={isVisible} animationType="slide">
        <View style={styles.modalContainer}>
          <Text style={{ fontSize: 25, fontWeight: 'bold', marginBottom: 40 }}>Adicione Sua Tarefa</Text>

          <TextInput style={styles.modalinput} underlineColor="transparent" 
            placeholder="Nome da Tarefa"
            value={newTask.name}
            onChangeText={(text) => onChange('name', text)}
          />
          
          <View style={styles.hora}>
            <View style={styles.horalow}>
              <Text style={{ fontSize: 20}}>Hora Inicio</Text>
              
              {this.state.show && (
                <DateTimePicker
                  testID="dateTimePicker"
                  value={this.state.date}
                  mode={this.state.mode}
                  is24Hour={true}
                  display="default"
                  onChange={this.onChangeDate}
                />
              )}
            </View>
            
            <View style={styles.horalow}>
              <Text style={{ fontSize: 20}}>Hora Fim</Text>

              {this.state.showf && (
                <DateTimePicker
                  testID="dateTimePicker"
                  value={this.state.datef}
                  mode={this.state.modef}
                  is24Hour={true}
                  display="default"
                  onChange={this.onChangeDatef}
                />
              )}
            </View>
          </View>

          <Button style={styles.modalbutton1} onPress={onSave}><Text style={styles.btntxt}>Salvar</Text></Button>
          <Button style={styles.modalbutton2} onPress={onClose}><Text style={styles.btntxt}>Cancelar</Text></Button>
        </View>
      </Modal>
    );
  }
}

const styles = StyleSheet.create({
  item: {
    backgroundColor: 'white',
    flex: 1,
    borderRadius: 5,
    padding: 10,
    marginRight: 10,
    marginTop: 17,
    flexDirection: 'row',
    alignItems: 'center',
    alignContent: 'center',
    justifyContent: 'space-between',
  },
  time: {
    fontWeight: 'bold',
    fontSize: 16,
    paddingBottom: 10,
  },
  btn: {
    width: 60,
    height: 40, 
    backgroundColor: '#f0f0f0',
    borderTopLeftRadius: 15,
    borderBottomRightRadius: 15,
    borderTopRightRadius: 0,
    borderBottomLeftRadius: 0,
    marginRight:20,
    margin: 10,
  },
  btntxt: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#000',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    
  },
  modalinput: {
    width: '80%',
    marginBottom: 10,
    borderTopLeftRadius: 15,
    borderBottomRightRadius: 15,
    backgroundColor: '#f0f0f0',
    borderBottomWidth: 0,
    borderBlockColor: '#000',
    fontWeight: 'bold',
  },
  modalbutton1: {
    width: '30%',
    marginBottom: 10,
    backgroundColor: '#92d9f0',
    marginTop: 30,
    marginLeft: '34%',
    borderTopLeftRadius: 15,
    borderBottomRightRadius: 15,
    borderTopRightRadius: 0,
    borderBottomLeftRadius: 0,
  },
  modalbutton2: {
    width: '30%',
    marginBottom: 10,
    backgroundColor: '#92d9f0',
    marginLeft: '34%',
    borderTopLeftRadius: 15,
    borderBottomRightRadius: 15,
    borderTopRightRadius: 0,
    borderBottomLeftRadius: 0,
  },
  add: {
    width: '80%',
    height: 60,
    backgroundColor: '#92d9f0',
    justifyContent: 'center',
    alignItems: 'center',
    borderTopLeftRadius: 15,
    borderBottomRightRadius: 15,
    borderTopRightRadius: 0,
    borderBottomLeftRadius: 0,
    borderColor: '#000',
    fontSize: 20,
    marginLeft: 40,
    fontWeight: 'bold',
  },
  loginContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    
  },
  logininput: {
    width: '80%',
    marginBottom: 10,
    borderTopLeftRadius: 15,
    borderBottomRightRadius: 15,
    backgroundColor: '#f0f0f0',
    borderBottomWidth: 0,
    borderBlockColor: '#000',
    fontWeight: 'bold',
  },
  loginbutton: {
    width: '30%',
    marginBottom: 10,
    backgroundColor: '#92d9f0',
    marginTop: 30,
    marginLeft: '34%',
    borderTopLeftRadius: 15,
    borderBottomRightRadius: 15,
    borderTopRightRadius: 0,
    borderBottomLeftRadius: 0,
  },
  hora: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    alignContent: 'center',
    width: '60%',
    marginTop: 25,
    marginBottom: 15,
  },
  horalow: {
    alignItems: 'center',
    alignContent: 'center'
  },
});

export default Calendar;