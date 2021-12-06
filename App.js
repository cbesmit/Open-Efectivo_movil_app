import React, { useState, useEffect } from 'react';

import {
  Box,
  Heading,
  AspectRatio,
  Image,
  Text,
  Center,
  HStack,
  VStack,
  Spacer,
  Stack,
  FormControl,
  Input,
  Switch,
  Button,
  FlatList,
  NativeBaseProvider,
} from "native-base"

import fetchServer from './fetchServer'


export default function App() {
  const [loading, setLoading] = useState(false);

  const [formData, setData] = useState({
    switch: true
  });

  const [listMov, setListMov] = useState([]);
  const [listMovTotal, setListMovTotal] = useState(0);

  function onChangeData(val, indx) {
    let dat = JSON.parse(JSON.stringify(formData));
    dat[indx] = val;
    setData(dat);
  };

  async function onSave() {
    if (formData.cantidad == undefined || formData.cantidad == null || formData.cantidad == '') return;

    let cantidad = 0;
    if (formData.switch) {
      if (parseFloat(formData.cantidad) < 0) { cantidad = parseFloat(formData.cantidad); }
      else { cantidad = parseFloat(formData.cantidad) * -1; }
    } else {
      if (parseFloat(formData.cantidad) < 0) { cantidad = parseFloat(formData.cantidad) * -1; }
      else { cantidad = parseFloat(formData.cantidad); }
    }

    let dataSend = {
      "descripcion": formData.descripcion,
      "fecha": new Date().toJSON().slice(0, 10),
      "cantidad": cantidad,
      "categoria_id": 1
    };

    //alert(JSON.stringify(dataSend));

    setLoading(true);
    await fetchServer.call('movimiento', 'POST', dataSend).then(data => {
      setData({switch: true});
      getList();
    }).catch(error => {
      console.log(error);

    });
    setLoading(false);
  };

  async function getList() {
    //setLoading(true);
    await fetchServer.call('movimiento', 'GET').then(data => {
      let total = 0;
      data.data.forEach(element => {
        total = total+element.cantidad;
      });
      let total2 = total;
      let init = 0;
      data.data.forEach(element => {
        element.total = total2;       
        total2 = total2-element.cantidad;

        var dateParts = element.fecha.split("-"); 
        element.fechaFormat =dateParts[2] + '/' + dateParts[1] + '/' + dateParts[0];
        
        element.cantidad = currencyFormat(element.cantidad);
        element.total = currencyFormat(element.total);


      });
      setListMov(data.data);
      setListMovTotal(total);
    }).catch(error => {
        console.log(error);
    });
    //setLoading(false);
}

function currencyFormat(num) {
  return '$' + num.toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
}

useEffect( () => {
  getList();
}, []);



  return (
    <NativeBaseProvider>
      <Center>

        <Box
          maxW="80"
          rounded="lg"
          overflow="hidden"
          borderColor="coolGray.200"
          borderWidth="1"
          _dark={{
            borderColor: "coolGray.600",
            backgroundColor: "gray.700",
          }}
          _web={{
            shadow: 2,
            borderWidth: 0,
          }}
          _light={{
            backgroundColor: "gray.50",
          }}
        >
          <Stack p="4" space={3}>
            <Stack space={2}>
              <Heading size="md" ml="-1">
                ${listMovTotal}
              </Heading>
            </Stack>
            <HStack alignItems="center" space={4} justifyContent="space-between">
              <HStack alignItems="center">


                <FormControl
                  w={{
                    base: "100%",
                    md: "25%",
                  }}
                >
                  <HStack alignItems="center" space={4}>
                    <Text>Egreso</Text>
                    <Switch size="lg"
                      isChecked={formData.switch}
                      onToggle={(value) => setData({ ...formData, switch: value })}
                      offTrackColor="orange.100"
                      onTrackColor="orange.200"
                      onThumbColor="orange.500"
                      offThumbColor="orange.50" 
                      isDisabled={loading}/>
                  </HStack>

                  <FormControl.Label>Cantidad</FormControl.Label>
                  <Input type="number" placeholder="0.00" value={formData.cantidad} onChangeText={(value) => setData({ ...formData, cantidad: value })} isDisabled={loading}/>

                  <FormControl.Label>Nota</FormControl.Label>
                  <Input type="text" placeholder="" value={formData.descripcion} onChangeText={(value) => setData({ ...formData, descripcion: value })} isDisabled={loading}/>

                  <Button onPress={onSave} mt="5" colorScheme="cyan" spinner={loading} isDisabled={loading}>
                    Guardar
                  </Button>

                </FormControl>

              </HStack>
            </HStack>
          </Stack>
        </Box>
        </Center>






      <FlatList
        data={listMov}
        renderItem={({ item }) => (
          <Box
            borderBottomWidth="1"
            _dark={{
              borderColor: "gray.600",
            }}
            borderColor="coolGray.200"
            pl="4"
            pr="5"
            py="2"
          >
            <HStack space={3} justifyContent="space-between">
              <VStack>
                <Text
                fontSize="xs"
                _dark={{
                    color: "warmGray.50",
                  }}
                  color="coolGray.800"
                >
                  {item.descripcion}
                </Text>
                <Text
                fontSize="xs"
                color="coolGray.500"
                  _dark={{
                    color: "warmGray.200",
                  }}
                >
                  {item.fechaFormat}
                </Text>
              </VStack>
              <Spacer />
              <Text
                _dark={{
                  color: "warmGray.50",
                }}
                bold
                color="coolGray.800"
                alignSelf="flex-start"
              >
                {item.cantidad}
              </Text>
              <Text
                _dark={{
                  color: "warmGray.50",
                }}
                color="coolGray.500"
                alignSelf="flex-start"
              >
                {item.total}
              </Text>
            </HStack>
          </Box>
        )}
        keyExtractor={(item) => item.id}
      />
 





    </NativeBaseProvider>
  );
}