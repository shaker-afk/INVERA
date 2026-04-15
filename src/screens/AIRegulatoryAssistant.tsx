import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Modal,
  Dimensions,
  Keyboard
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Markdown from 'react-native-markdown-display';
import { fetchRegulatoryData, ChatMessage, RegulatoryData } from '../services/firebaseService';
import { generateRegulatoryResponse } from '../services/aiService';

const { width, height } = Dimensions.get('window');

export default function AIRegulatoryAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [data, setData] = useState<RegulatoryData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isTyping, setIsTyping] = useState(false);
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  useEffect(() => {
    if (Platform.OS !== 'ios') return;

    const showSub = Keyboard.addListener('keyboardWillShow', (e) => {
      setKeyboardHeight(e.endCoordinates.height);
    });
    const hideSub = Keyboard.addListener('keyboardWillHide', () => {
      setKeyboardHeight(0);
    });

    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  useEffect(() => {
    if (isOpen && !data) {
      const loadMockData = async () => {
        setLoading(true);
        const res = await fetchRegulatoryData();
        setData(res);
        setLoading(false);
      };
      loadMockData();
    }
  }, [isOpen]);

  const handleSend = async () => {
    if (!query.trim()) return;
    const userText = query.trim();
    
    const newUserMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: userText,
      timestamp: new Date()
    };
    
    // Add user message to UI immediately
    setData((prev) => {
      if (!prev) return prev;
      return { ...prev, messages: [...prev.messages, newUserMessage] };
    });
    setQuery('');
    setIsTyping(true);

    // Call real AI API via OpenRouter using the updated message context
    const currentMessages = data?.messages ? [...data.messages, newUserMessage] : [newUserMessage];
    const aiResponseText = await generateRegulatoryResponse(currentMessages);

    // Stop typing and append AI response
    setIsTyping(false);
    const newAiMessage: ChatMessage = {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content: aiResponseText,
      timestamp: new Date()
    };

    setData((prev) => {
      if (!prev) return prev;
      return { ...prev, messages: [...prev.messages, newAiMessage] };
    });
  };

  return (
    <>
      {/* Floating Chat Bubble */}
      {!isOpen && (
        <TouchableOpacity
          style={styles.floatingBubble}
          onPress={() => setIsOpen(true)}
          activeOpacity={0.8}
        >
          <MaterialCommunityIcons name="robot-outline" size={28} color="#ffffff" />
        </TouchableOpacity>
      )}

      {/* Expanded Modal */}
      <Modal
        visible={isOpen}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setIsOpen(false)}
      >
        <View style={[styles.container, { paddingBottom: keyboardHeight }]}>
          <SafeAreaView style={styles.safeArea}>
            <View style={styles.header}>
              <View style={styles.headerTextWrap}>
                <Text style={styles.title}>AI Assistant</Text>
                <Text style={styles.subtitle}>Regulatory & Investment Guidance</Text>
              </View>
              <TouchableOpacity onPress={() => setIsOpen(false)} style={styles.closeButton}>
                <MaterialCommunityIcons name="close" size={24} color="#000a1e" />
              </TouchableOpacity>
            </View>

            {loading || !data ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#002147" />
                <Text style={styles.loadingText}>Connecting to Regulatory Core...</Text>
              </View>
            ) : (
              <>
                <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                  {/* Studies Section */}
                  <Text style={styles.sectionTitle}>Relevant Feasibility Studies</Text>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.studiesScroll}>
                    {data.studies.map((study) => (
                      <View key={study.id} style={styles.studyCard}>
                        <View style={styles.studyIconContainer}>
                          <MaterialCommunityIcons name="file-document-outline" size={24} color="#706439" />
                        </View>
                        <Text style={styles.studyTitle} numberOfLines={2}>{study.title}</Text>
                        <Text style={styles.studyMeta}>{study.size} • {study.date.toLocaleDateString()}</Text>
                      </View>
                    ))}
                  </ScrollView>

                  {/* Chat Interface */}
                  <View style={styles.chatSection}>
                    {data.messages.map((msg) => (
                      <View 
                        key={msg.id} 
                        style={[
                          styles.messageBubble, 
                          msg.role === 'user' ? styles.userBubble : styles.assistantBubble
                        ]}
                      >
                        {msg.role === 'assistant' && (
                          <View style={styles.assistantAvatar}>
                            <MaterialCommunityIcons name="robot-outline" size={16} color="#ffffff" />
                          </View>
                        )}
                        <View style={[
                          styles.messageContent,
                          msg.role === 'user' ? styles.userMessageContent : styles.assistantMessageContent
                        ]}>
                          <Markdown 
                            style={{
                              body: [
                                styles.messageText,
                                msg.role === 'user' ? styles.userMessageText : styles.assistantMessageText,
                                { marginTop: 0, marginBottom: 0 }
                              ],
                              paragraph: {
                                marginTop: 0,
                                marginBottom: 4,
                              }
                            }}
                          >
                            {msg.content}
                          </Markdown>
                        </View>
                      </View>
                    ))}
                    {isTyping && (
                      <View style={[styles.messageBubble, styles.assistantBubble]}>
                        <View style={styles.assistantAvatar}>
                            <MaterialCommunityIcons name="robot-outline" size={16} color="#ffffff" />
                        </View>
                        <View style={[styles.messageContent, styles.assistantMessageContent]}>
                          <ActivityIndicator size="small" color="#002147" />
                        </View>
                      </View>
                    )}
                  </View>
                </ScrollView>

                <View style={styles.inputContainer}>
                  <TextInput
                    style={[styles.input, isFocused && styles.inputFocused]}
                    placeholder="Ask about regulations, taxes, or limits..."
                    placeholderTextColor="#74777f"
                    value={query}
                    onChangeText={setQuery}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    multiline
                  />
                  <TouchableOpacity 
                    style={[styles.sendButton, !query.trim() && styles.sendButtonDisabled]} 
                    onPress={handleSend}
                    disabled={!query.trim()}
                  >
                    <MaterialCommunityIcons 
                      name="arrow-up" 
                      size={20} 
                      color={query.trim() ? '#ffffff' : '#74777f'} 
                    />
                  </TouchableOpacity>
                </View>
              </>
            )}
          </SafeAreaView>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  floatingBubble: {
    position: 'absolute',
    bottom: 100, // Above tab bar if present
    right: 24,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#002147', // primary-container
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000a1e',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 8,
    zIndex: 9999, // ensures it sits above everything
  },
  safeArea: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    color: '#002147',
    fontSize: 14,
    fontWeight: '500',
  },
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  headerTextWrap: {
    flex: 1,
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f3f4f5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#000a1e',
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 14,
    color: '#708ab5',
    marginTop: 4,
  },
  scrollContent: {
    paddingBottom: 24,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#44474e',
    marginHorizontal: 24,
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  studiesScroll: {
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  studyCard: {
    backgroundColor: '#ffffff',
    borderRadius: 24,
    padding: 16,
    marginRight: 16,
    width: 160,
    shadowColor: '#000a1e',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 2,
  },
  studyIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#f3e2ac',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  studyTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#191c1d',
    marginBottom: 8,
  },
  studyMeta: {
    fontSize: 12,
    color: '#74777f',
  },
  chatSection: {
    paddingHorizontal: 24,
  },
  messageBubble: {
    flexDirection: 'row',
    marginBottom: 24,
    alignItems: 'flex-start',
  },
  userBubble: {
    justifyContent: 'flex-end',
  },
  assistantBubble: {
    justifyContent: 'flex-start',
  },
  assistantAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#002147',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  messageContent: {
    maxWidth: '80%',
    padding: 16,
    borderRadius: 20,
  },
  userMessageContent: {
    backgroundColor: '#002147',
    borderBottomRightRadius: 4,
  },
  assistantMessageContent: {
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 4,
    shadowColor: '#000a1e',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 1,
  },
  messageText: {
    fontSize: 15,
    lineHeight: 22,
  },
  assistantMessageText: {
    color: '#191c1d',
  },
  userMessageText: {
    color: '#ffffff',
  },
  inputContainer: {
    padding: 16,
    paddingHorizontal: 24,
    backgroundColor: '#ffffff',
    flexDirection: 'row',
    alignItems: 'flex-end',
    shadowColor: '#000a1e',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.04,
    shadowRadius: 12,
    elevation: 5,
  },
  input: {
    flex: 1,
    backgroundColor: '#f3f4f5',
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 14,
    maxHeight: 120,
    fontSize: 15,
    color: '#191c1d',
  },
  inputFocused: {
    borderWidth: 1,
    borderColor: 'rgba(194, 178, 128, 0.5)',
    backgroundColor: '#ffffff',
  },
  sendButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#002147',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 12,
  },
  sendButtonDisabled: {
    backgroundColor: '#f3f4f5',
  }
});
