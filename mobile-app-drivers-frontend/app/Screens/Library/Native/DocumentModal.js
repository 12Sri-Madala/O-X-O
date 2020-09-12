import React from "react";
import Modal from "react-native-modal";
import { StyleSheet, View, Text } from "react-native";

import { Colors, Icons, Spacing, Font } from "./StyleGuide";

import OxoButton from "./OxoButton";

export default class DocumentModal extends React.Component {
  render() {
    return (
      <View style={styles.screenContainer}>
        <Modal
          isVisible={this.props.visible}
          onBackdropPress={this.props.close}
        >
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.documentsHeader}>
                <Text>Vehicle Documents</Text>
              </Text>
            </View>
            <Text style={styles.documentsCar}>
              {this.props.carMake}
              {this.props.carModel}
              {this.props.carYear}
            </Text>
            <Text style={styles.documentsText}>
              <Text>
                Upload these documents to Uber/Lyft at least 48 hours before
                your rental {"\n"} {"\n"}
                Download these documents to your photos folder below then upload
              </Text>
            </Text>
            <View style={styles.modalButton}>
              <OxoButton
                type="contained"
                buttonSize="large"
                fontSize="large"
                content="DOWNLOAD"
                color="secondary"
                onPress={() => {
                  this.props.download();
                  this.props.close;
                }}
                width2height={5}
              />
            </View>
          </View>
        </Modal>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  screenContainer: {
    flexDirection: "column",
    width: "100%",
    height: "100%",
    alignItems: "center"
  },
  modalContent: {
    backgroundColor: Colors.white,
    borderRadius: Spacing.tiny,
    borderColor: "rgba(0, 0, 0, 0.1)"
  },
  modalHeader: {
    borderTopLeftRadius: Spacing.tiny,
    borderTopRightRadius: Spacing.tiny,
    width: "100%",
    backgroundColor: Colors.primary
  },
  documentsHeader: {
    color: Colors.white,
    fontSize: Font.title_3,
    marginLeft: Spacing.small,
    marginTop: Spacing.small,
    marginBottom: Spacing.small
  },
  modalButton: {
    alignItems: "center",
    padding: Spacing.base
  },
  documentsText: {
    color: Colors.primary,
    fontSize: Font.large,
    paddingTop: Spacing.small,
    paddingHorizontal: Spacing.small
  },
  documentsCar: {
    color: Colors.primary,
    fontSize: Font.title_3,
    paddingTop: Spacing.small,
    paddingHorizontal: Spacing.small
  }
});
