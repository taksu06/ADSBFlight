package codeCommandos.flightADSB;


import java.awt.*;
import java.awt.image.BufferedImage;
import java.io.*;
import java.net.URL;
import javax.imageio.ImageIO;
import javax.swing.*;

public class Map extends JPanel {

    private JPanel panel; // Harita paneli alanı eklendi

    public Map() throws IOException {
        JFrame frame = new JFrame("Google Maps");

        // Google Maps resmini indir ve panelde göster
        JLabel mapLabel = new JLabel();
        ImageIcon mapImage = new ImageIcon(new URL("https://maps.googleapis.com/maps/api/staticmap?center=&zoom=1&scale=2&size=600x300&maptype=roadmap&format=png&key=AIzaSyATLuSX1D6kHXNTsAF3aZuTPUO__BdYAsc"));
        mapLabel.setIcon(mapImage);

        // Panel oluştur ve bileşenleri ekleyerek düzenle
        panel = new JPanel(null);
        panel.setPreferredSize(new Dimension(1200, 600));
        mapLabel.setBounds(0, 0, 1200, 600);

        // Bileşenleri panele ekle
        panel.add(mapLabel);

        // Frame'e paneli ekle
        frame.add(panel);

        frame.pack();
        frame.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        frame.setVisible(true);
    }

    public void ucakEkle(int enlem, int boylam) throws IOException {

        // Uçağı göstermek için bir etiket oluştur
        BufferedImage planePicture = ImageIO.read(new File("C:\\Users\\tuğberk\\IdeaProjects\\ucakssss\\src\\main\\java\\pngegg.png"));
        JLabel planeLabel = new JLabel(new ImageIcon(planePicture));
        planeLabel.setBounds(enlem, boylam, 50, 50); // Uçak resmi boyut ve konumunu ayarla, istediğiniz konuma göre değiştirilebilir
        panel.add(planeLabel); // Uçak resmini harita paneline ekle
        panel.revalidate(); // Panelin yeniden çizilmesini sağla
        panel.repaint(); // Paneli yeniden boyayarak güncellemeyi sağla
        panel.setComponentZOrder(planeLabel, 0);
    }


}
