import {
  Document,
  Page,
  View,
  Text,
  Image,
  Font,
  StyleSheet,
} from "@react-pdf/renderer";

Font.register({
  family: "Inter",
  fonts: [
    {
      src: "https://fonts.gstatic.com/s/inter/v18/UcCO3FwrK3iLTeHuS_nVMrMxCp50SjIw2boKoduKmMEVuLyfAZ9hjp-Ek-_EeA.woff",
      fontWeight: 400,
    },
    {
      src: "https://fonts.gstatic.com/s/inter/v18/UcCO3FwrK3iLTeHuS_nVMrMxCp50SjIw2boKoduKmMEVuI6fAZ9hjp-Ek-_EeA.woff",
      fontWeight: 600,
    },
    {
      src: "https://fonts.gstatic.com/s/inter/v18/UcCO3FwrK3iLTeHuS_nVMrMxCp50SjIw2boKoduKmMEVuFuYAZ9hjp-Ek-_EeA.woff",
      fontWeight: 700,
    },
  ],
});

const HEADER_COLOR = "#1e2939";

const styles = StyleSheet.create({
  page: {
    fontFamily: "Inter",
    fontSize: 11,
    paddingBottom: 40,
  },
  header: {
    height: 60,
    backgroundColor: HEADER_COLOR,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 40,
  },
  logo: {
    width: 128,
    height: 36,
  },
  content: {
    paddingHorizontal: 40,
    paddingTop: 30,
  },
  productName: {
    fontSize: 22,
    fontWeight: 700,
    color: "#111827",
    marginBottom: 16,
  },
  modelNumberLabel: {
    fontSize: 10,
    fontWeight: 600,
    color: "#6b7280",
    marginBottom: 4,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  modelNumber: {
    fontSize: 14,
    fontWeight: 600,
    color: "#111827",
    marginBottom: 24,
  },
  description: {
    fontSize: 11,
    lineHeight: 1.6,
    color: "#374151",
    marginBottom: 30,
    textAlign: "justify",
  },
  imageContainer: {
    alignItems: "center",
    marginTop: 20,
  },
  productImage: {
    maxWidth: 300,
    maxHeight: 300,
    objectFit: "contain",
  },
});

export interface ProductPdfData {
  productName: string;
  modelNumber: string;
  description: string;
  imageUrl?: string | null;
  logoUrl: string;
}

interface ProductPdfDocumentProps {
  data: ProductPdfData;
}

export function ProductPdfDocument({ data }: ProductPdfDocumentProps) {
  const { productName, modelNumber, description, imageUrl, logoUrl } = data;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Image src={logoUrl} style={styles.logo} />
        </View>

        <View style={styles.content}>
          <Text style={styles.productName}>{productName}</Text>

          <Text style={styles.modelNumberLabel}>Model Number:</Text>
          <Text style={styles.modelNumber}>{modelNumber}</Text>

          <Text style={styles.description}>{description}</Text>

          {imageUrl && (
            <View style={styles.imageContainer}>
              <Image src={imageUrl} style={styles.productImage} />
            </View>
          )}
        </View>
      </Page>
    </Document>
  );
}