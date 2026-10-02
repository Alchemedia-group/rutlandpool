import { StatusBar } from "expo-status-bar";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  BackHandler,
  Linking,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import WebView, { type WebViewNavigation } from "react-native-webview";

const SITE_URL = "https://rutlandcountypoolleague.com";
const SITE_HOSTNAME = new URL(SITE_URL).hostname;
const FELT_DARK = "#123D2A";
const CREAM = "#FFFDF8";
// Some Android WebView versions don't reliably fire onLoadEnd after every
// navigation — onLoadProgress reaching 1 is the primary, fast signal that
// the page has actually finished loading. This backstop only covers the
// rare case where even that doesn't fire, so it's short, not a blind wait.
const LOADING_TIMEOUT_MS = 1500;

export default function App() {
  return (
    <SafeAreaProvider>
      <StatusBar style="light" />
      <SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}>
        <SiteWebView />
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

function SiteWebView() {
  const webViewRef = useRef<WebView>(null);
  const [canGoBack, setCanGoBack] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [loading, setLoading] = useState(true);
  const [reloadKey, setReloadKey] = useState(0);

  const handleNavigationStateChange = useCallback((navState: WebViewNavigation) => {
    setCanGoBack(navState.canGoBack);
  }, []);

  // The site rebuilds with new content-hashed JS filenames on every deploy.
  // If the WebView's own HTTP cache is holding an older cached page that
  // references a since-deleted chunk filename, that chunk 404s and the
  // page's JS never finishes loading — breaking in-app navigation beyond
  // whatever page happened to be cached. Clearing on mount, on top of
  // disabling the cache below, guards against a stale cache surviving an
  // in-place app update from an earlier version.
  useEffect(() => {
    webViewRef.current?.clearCache(true);
  }, []);

  useEffect(() => {
    if (!loading) return;
    const timeout = setTimeout(() => setLoading(false), LOADING_TIMEOUT_MS);
    return () => clearTimeout(timeout);
  }, [loading]);

  // Android hardware/gesture back button steps back through the site's own
  // history before falling through to the OS default (closing the app).
  useEffect(() => {
    if (Platform.OS !== "android") return;
    const subscription = BackHandler.addEventListener("hardwareBackPress", () => {
      if (canGoBack && webViewRef.current) {
        webViewRef.current.goBack();
        return true;
      }
      return false;
    });
    return () => subscription.remove();
  }, [canGoBack]);

  const retry = () => {
    setHasError(false);
    setLoading(true);
    setReloadKey((key) => key + 1);
  };

  if (hasError) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorTitle}>Can&apos;t reach the site</Text>
        <Text style={styles.errorBody}>Check your internet connection and try again.</Text>
        <Pressable onPress={retry} style={styles.retryButton}>
          <Text style={styles.retryText}>Retry</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <WebView
        key={reloadKey}
        ref={webViewRef}
        source={{ uri: SITE_URL }}
        style={styles.webview}
        onNavigationStateChange={handleNavigationStateChange}
        onLoadStart={() => setLoading(true)}
        onLoadEnd={() => setLoading(false)}
        onLoadProgress={(event) => {
          if (event.nativeEvent.progress >= 1) setLoading(false);
        }}
        onError={() => setHasError(true)}
        onHttpError={(event) => {
          if (event.nativeEvent.statusCode >= 500) setHasError(true);
        }}
        pullToRefreshEnabled
        allowsBackForwardNavigationGestures
        setSupportMultipleWindows={false}
        javaScriptEnabled
        domStorageEnabled
        cacheEnabled={false}
        originWhitelist={["https://*"]}
        onShouldStartLoadWithRequest={(request) => {
          // Keep the site itself inside the app; hand anything else (a
          // WhatsApp link, a map, an external site) off to the OS. Compared
          // by hostname rather than a raw string prefix so a trailing
          // slash, query string, or port doesn't fail the check.
          if (request.url === "about:blank") return true;
          try {
            if (new URL(request.url).hostname === SITE_HOSTNAME) return true;
          } catch {
            // Not a parseable absolute URL — fall through to external.
          }
          Linking.openURL(request.url).catch(() => {});
          return false;
        }}
      />
      {loading && (
        <View style={[StyleSheet.absoluteFill, styles.loadingOverlay]} pointerEvents="none">
          <ActivityIndicator size="large" color={FELT_DARK} />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: FELT_DARK,
  },
  container: {
    flex: 1,
    backgroundColor: CREAM,
  },
  webview: {
    flex: 1,
    backgroundColor: CREAM,
  },
  loadingOverlay: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: CREAM,
  },
  errorContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 32,
    backgroundColor: CREAM,
  },
  errorTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1B1815",
    marginBottom: 8,
  },
  errorBody: {
    fontSize: 14,
    color: "#1B181599",
    textAlign: "center",
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: FELT_DARK,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryText: {
    color: "#FFFFFF",
    fontWeight: "600",
  },
});
